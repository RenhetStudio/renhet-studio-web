create extension if not exists pgcrypto;

create type public.user_role as enum ('reader', 'author', 'admin');
create type public.post_status as enum ('draft', 'published');
create type public.comment_status as enum ('pending', 'approved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 60),
  role public.user_role not null default 'reader',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 160),
  excerpt text not null default '' check (char_length(excerpt) <= 320),
  category text not null check (category in (
    'Dev Log', 'Art', 'Marketing', 'Design', 'Programming', 'Production',
    'Animation', 'VFX', 'Sound design', 'Music', 'General', 'Recommendations'
  )),
  cover_image_url text,
  cover_image_alt text not null default '' check (char_length(cover_image_alt) <= 180),
  content jsonb not null default '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb,
  status public.post_status not null default 'draft',
  published_at timestamptz,
  author_id uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_document tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B')
  ) stored,
  constraint published_posts_need_a_date check (status = 'draft' or published_at is not null)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 60),
  body text not null check (char_length(body) between 1 and 2000),
  status public.comment_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_publication_idx on public.posts (status, published_at desc);
create index posts_category_idx on public.posts (category, published_at desc);
create index posts_search_idx on public.posts using gin (search_document);
create index comments_post_idx on public.comments (post_id, status, created_at);
create index comments_user_rate_idx on public.comments (user_id, created_at desc);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger posts_set_updated_at before update on public.posts
for each row execute function public.set_updated_at();
create trigger comments_set_updated_at before update on public.comments
for each row execute function public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1), 'Reader'), 60)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create function public.is_author(check_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = check_user_id and role in ('author', 'admin')
  );
$$;

create function public.validate_new_comment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  profile_name text;
begin
  if auth.uid() is null or new.user_id <> auth.uid() then
    raise exception 'Authentication required';
  end if;

  if not exists (
    select 1 from public.posts
    where id = new.post_id and status = 'published' and published_at <= now()
  ) then
    raise exception 'Post is not available for comments';
  end if;

  if exists (
    select 1 from public.comments
    where user_id = auth.uid() and created_at > now() - interval '30 seconds'
  ) then
    raise exception 'Please wait before commenting again';
  end if;

  if (select count(*) from public.comments
      where user_id = auth.uid() and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'Hourly comment limit reached';
  end if;

  select display_name into profile_name from public.profiles where id = auth.uid();
  new.display_name := profile_name;
  new.body := btrim(new.body);
  new.status := 'pending';
  return new;
end;
$$;

create trigger comments_validate_insert
before insert on public.comments
for each row execute function public.validate_new_comment();

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;

create policy "Users can read their own profile"
on public.profiles for select
using (id = auth.uid() or public.is_author());

create policy "Users can update their own profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

create policy "Published posts are public"
on public.posts for select
using (
  (status = 'published' and published_at <= now())
  or public.is_author()
);

create policy "Authors create posts"
on public.posts for insert
with check (public.is_author() and author_id = auth.uid());

create policy "Authors update posts"
on public.posts for update
using (public.is_author())
with check (public.is_author());

create policy "Authors delete posts"
on public.posts for delete
using (public.is_author());

create policy "Approved comments are public"
on public.comments for select
using (status = 'approved' or user_id = auth.uid() or public.is_author());

create policy "Authenticated users submit comments"
on public.comments for insert
to authenticated
with check (user_id = auth.uid() and status = 'pending');

create policy "Authors moderate comments"
on public.comments for update
using (public.is_author())
with check (public.is_author());

create policy "Authors delete comments"
on public.comments for delete
using (public.is_author());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-media',
  'blog-media',
  true,
  52428800,
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm',
    'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/webm'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public reads blog media"
on storage.objects for select
using (bucket_id = 'blog-media');

create policy "Authors upload blog media"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'blog-media'
  and public.is_author()
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Authors update blog media"
on storage.objects for update
to authenticated
using (bucket_id = 'blog-media' and public.is_author())
with check (bucket_id = 'blog-media' and public.is_author());

create policy "Authors delete blog media"
on storage.objects for delete
to authenticated
using (bucket_id = 'blog-media' and public.is_author());

grant execute on function public.is_author(uuid) to anon, authenticated;
grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;
grant select on public.comments to anon, authenticated;
grant insert, update, delete on public.comments to authenticated;
grant select on public.profiles to authenticated;

