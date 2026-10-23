-- Apply after 001_portfolio.sql. No anonymous or ordinary user table access.
begin;
alter table public.contact_submissions add column if not exists inbox_hash text;
alter table public.contact_submissions add column if not exists status text not null default 'new' check(status in ('new','replied','closed'));
alter table public.contact_submissions add column if not exists last_activity timestamptz not null default now();
create unique index if not exists contact_inbox_hash on public.contact_submissions(inbox_hash) where inbox_hash is not null;
create index if not exists contact_activity on public.contact_submissions(last_activity desc);
create table if not exists public.conversation_messages (
 id uuid primary key,contact_id uuid not null references public.contact_submissions(id) on delete cascade,
 author text not null check(author in ('visitor','owner')),body text not null check(length(trim(body)) between 1 and 3000),
 created_at timestamptz not null default now()
);
alter table public.conversation_messages enable row level security;
revoke all on public.conversation_messages from anon,authenticated;
grant all on public.conversation_messages to service_role;
create index if not exists conversation_message_order on public.conversation_messages(contact_id,created_at,id);
create or replace function public.append_portfolio_message(thread_id uuid,message_author text,message_body text,request_id uuid)
returns void language plpgsql security invoker set search_path='' as $$
declare current_status text;existing_message public.conversation_messages%rowtype;
begin
 select status into current_status from public.contact_submissions where id=thread_id for update;
 if not found then raise exception 'Conversation unavailable';end if;
 select * into existing_message from public.conversation_messages where id=request_id;
 if found then
  if existing_message.contact_id=thread_id and existing_message.author=message_author and existing_message.body=message_body then return;end if;
  raise exception 'Request ID conflict';
 end if;
 if current_status='closed' then raise exception 'Conversation closed';end if;
 if (select count(*) from public.conversation_messages where contact_id=thread_id)>=200 then raise exception 'Conversation limit reached';end if;
 insert into public.conversation_messages(id,contact_id,author,body) values(request_id,thread_id,message_author,message_body);
 update public.contact_submissions set status=case when message_author='visitor' then 'new' else 'replied' end,last_activity=now() where id=thread_id;
end;$$;
revoke all on function public.append_portfolio_message(uuid,text,text,uuid) from public,anon,authenticated;
grant execute on function public.append_portfolio_message(uuid,text,text,uuid) to service_role;
commit;
-- Messages cascade-delete when their original contact submission is removed.
-- The existing 180-day retention period runs from the original submission date.

