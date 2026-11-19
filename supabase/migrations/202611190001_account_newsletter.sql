begin;

create function public.manage_my_newsletter_subscription(subscribe boolean default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  account_email text;
begin
  select lower(btrim(email)) into account_email
  from auth.users
  where id = auth.uid()
    and email_confirmed_at is not null
    and nullif(btrim(email), '') is not null;

  if account_email is null then
    return null;
  end if;

  if subscribe is true then
    perform public.subscribe_newsletter(account_email);
  elsif subscribe is false then
    delete from public.newsletter_subscribers where email = account_email;
  end if;

  return jsonb_build_object(
    'email', account_email,
    'subscribed', exists (
      select 1 from public.newsletter_subscribers where email = account_email
    )
  );
end;
$$;

revoke all on function public.manage_my_newsletter_subscription(boolean) from public, anon, authenticated;
grant execute on function public.manage_my_newsletter_subscription(boolean) to authenticated;

commit;
