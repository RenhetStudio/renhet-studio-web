-- Authors may only modify media inside their own UUID-named folder.
drop policy if exists "Authors update blog media" on storage.objects;
create policy "Authors update their own blog media"
on storage.objects for update
to authenticated
using (
  bucket_id = 'blog-media'
  and public.is_author()
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'blog-media'
  and public.is_author()
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Authors delete blog media" on storage.objects;
create policy "Authors delete their own blog media"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'blog-media'
  and public.is_author()
  and (storage.foldername(name))[1] = auth.uid()::text
);
