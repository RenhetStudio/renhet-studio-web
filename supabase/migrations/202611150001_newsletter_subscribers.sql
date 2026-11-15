begin;

create table public.newsletter_subscribers (
  email text primary key
    check (email = lower(btrim(email)))
    check (char_length(email) between 3 and 254)
    check (email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'),
  suscribed_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;
revoke all on public.newsletter_subscribers from public, anon, authenticated;

-- Public callers may subscribe, but cannot read, update or delete the list.
create function public.subscribe_newsletter(subscriber_email text)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.newsletter_subscribers (email)
  values (lower(btrim(subscriber_email)))
  on conflict (email) do nothing;
$$;

revoke all on function public.subscribe_newsletter(text) from public, anon, authenticated;
grant execute on function public.subscribe_newsletter(text) to anon, authenticated;

commit;
