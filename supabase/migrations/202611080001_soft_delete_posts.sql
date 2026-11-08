-- Migration: Add soft delete support to posts
-- Run this in your Supabase SQL Editor

-- 1. Add deleted_at column
alter table public.posts
add column if not exists deleted_at timestamptz default null;

-- 2. Index for filtering active posts efficiently
create index if not exists posts_deleted_at_idx
on public.posts (deleted_at);

-- 3. Update public read policy to exclude soft-deleted posts
drop policy if exists "Published posts are public" on public.posts;

create policy "Published posts are public"
on public.posts for select
using (
  (status = 'published' and published_at <= now() and deleted_at is null)
  or public.is_author()
);

-- 4. Replace global unique constraint on slug with partial unique index for active posts
-- This allows reusing slugs if a previous post was soft-deleted
alter table public.posts
drop constraint if exists posts_slug_key;

create unique index if not exists posts_slug_active_unique
on public.posts (slug)
where deleted_at is null;

