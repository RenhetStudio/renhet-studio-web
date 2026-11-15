-- Run after the migration in a test database. All fixture changes roll back.
begin;

do $$
declare
  original_date timestamptz;
begin
  delete from public.newsletter_subscribers where email = 'newsletter-test@example.invalid';
  perform public.subscribe_newsletter(' Newsletter-Test@Example.Invalid ');
  select suscribed_at into original_date from public.newsletter_subscribers
    where email = 'newsletter-test@example.invalid';
  assert original_date is not null, 'Subscription must have a server-generated timestamp';
  perform public.subscribe_newsletter('newsletter-test@example.invalid');
  assert (select count(*) = 1 and min(suscribed_at) = original_date
    from public.newsletter_subscribers where email = 'newsletter-test@example.invalid'),
    'Duplicate subscriptions must preserve the original row';
  assert not has_table_privilege('anon', 'public.newsletter_subscribers', 'SELECT'), 'Anonymous reads must be denied';
  assert not has_table_privilege('authenticated', 'public.newsletter_subscribers', 'SELECT'), 'Authenticated reads must be denied';
  assert not has_table_privilege('anon', 'public.newsletter_subscribers', 'INSERT,UPDATE,DELETE'), 'Direct anonymous writes must be denied';
  assert not has_table_privilege('authenticated', 'public.newsletter_subscribers', 'INSERT,UPDATE,DELETE'), 'Direct authenticated writes must be denied';
  assert has_function_privilege('anon', 'public.subscribe_newsletter(text)', 'EXECUTE'), 'Public subscription RPC must be callable';
end;
$$;

set local role anon;
select public.subscribe_newsletter('newsletter-test@example.invalid');
reset role;

rollback;
