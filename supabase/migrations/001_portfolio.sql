-- Run in the Supabase SQL Editor. No public client can read OR write these tables.
create table public.page_views (
 id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
 path text not null check (length(path)<=200), session_id uuid not null,
 referrer text check (length(referrer)<=253), consent boolean not null check(consent)
);
create table public.analytics_events (
 id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
 path text not null check(length(path)<=200), session_id uuid not null,
 referrer text check(length(referrer)<=253), consent boolean not null check(consent),
 event_type text not null check(event_type in ('resume_download','contact_click','linkedin_click','github_click'))
);
create table public.identified_visitors (
 id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
 name text not null check(length(name)<=100), company text, role text, linkedin text, email text, message text,
 consent boolean not null check(consent), link_consent boolean not null default false,
 session_id uuid, check(link_consent or session_id is null)
);
create table public.contact_submissions (
 id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
 name text not null, email text not null, message text not null, consent boolean not null check(consent)
);
create table public.rate_limits (key text primary key,hits integer not null default 1,created_at timestamptz not null default now());
alter table public.page_views enable row level security;
alter table public.analytics_events enable row level security;
alter table public.identified_visitors enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.rate_limits enable row level security;
revoke all on public.page_views,public.analytics_events,public.identified_visitors,public.contact_submissions,public.rate_limits from anon,authenticated;
grant all on public.page_views,public.analytics_events,public.identified_visitors,public.contact_submissions,public.rate_limits to service_role;
create index on public.page_views(created_at);
create index on public.page_views(session_id);
create index on public.analytics_events(created_at);
create index on public.identified_visitors(created_at);
create index on public.contact_submissions(created_at);
create or replace function public.take_rate_limit(bucket_key text,max_hits integer) returns boolean
language plpgsql security definer set search_path=public as $$
declare total integer;
begin
 delete from public.rate_limits where created_at < now()-interval '2 hours';
 insert into public.rate_limits(key) values(bucket_key) on conflict(key) do update set hits=rate_limits.hits+1 returning hits into total;
 return total<=max_hits;
end; $$;
revoke all on function public.take_rate_limit(text,integer) from public,anon,authenticated;
grant execute on function public.take_rate_limit(text,integer) to service_role;
-- Enable pg_cron in Supabase, then run 002_retention.sql.
