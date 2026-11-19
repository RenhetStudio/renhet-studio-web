-- Run after the newsletter migrations in a test database. All fixture changes roll back.
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

insert into auth.users (id, email, email_confirmed_at) values
  ('7d67e00f-ea1a-4e29-bba7-d925dbbb18c1', 'Newsletter-Account@Example.Invalid', now()),
  ('7d67e00f-ea1a-4e29-bba7-d925dbbb18c2', 'newsletter-unverified@example.invalid', null);

select public.subscribe_newsletter('newsletter-account@example.invalid');
select public.subscribe_newsletter('newsletter-unverified@example.invalid');

do $$
begin
  assert not has_function_privilege('anon', 'public.manage_my_newsletter_subscription(boolean)', 'EXECUTE'),
    'Account subscription management must require authentication';
end;
$$;

set local role authenticated;
set local request.jwt.claim.sub = '7d67e00f-ea1a-4e29-bba7-d925dbbb18c1';

do $$
begin
  assert public.manage_my_newsletter_subscription() =
    '{"email":"newsletter-account@example.invalid","subscribed":true}'::jsonb,
    'A public signup must appear in the matching account';
  assert (public.manage_my_newsletter_subscription(false)->>'subscribed')::boolean is false,
    'The confirmed address can unsubscribe';
  assert (public.manage_my_newsletter_subscription(false)->>'subscribed')::boolean is false,
    'Repeated opt-outs are safe';
  assert (public.manage_my_newsletter_subscription(true)->>'subscribed')::boolean is true,
    'The confirmed address can subscribe again';
  assert (public.manage_my_newsletter_subscription(true)->>'subscribed')::boolean is true,
    'Repeated opt-ins are safe';
  perform public.manage_my_newsletter_subscription(false);
end;
$$;

set local request.jwt.claim.sub = '7d67e00f-ea1a-4e29-bba7-d925dbbb18c2';

do $$
begin
  assert public.manage_my_newsletter_subscription() is null,
    'An unverified account must not be able to read the subscription';
  assert public.manage_my_newsletter_subscription(false) is null,
    'An unverified account must not be able to delete the subscription';
end;
$$;

reset role;

do $$
begin
  assert not exists (select 1 from public.newsletter_subscribers where email = 'newsletter-account@example.invalid'),
    'The opt-out must be stored in the database';
  assert exists (select 1 from public.newsletter_subscribers where email = 'newsletter-unverified@example.invalid'),
    'The other address must remain subscribed';
end;
$$;

rollback;
