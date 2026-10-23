-- Only needed for the optional server bridge; direct service-role mode also works.
create table if not exists public.portfolio_server_credentials (
 name text primary key,key_hash text not null unique check(length(key_hash)=64),
 revoked boolean not null default false,created_at timestamptz not null default now()
);
alter table public.portfolio_server_credentials enable row level security;
revoke all on public.portfolio_server_credentials from anon,authenticated;
grant select on public.portfolio_server_credentials to service_role;
-- Provision a SHA-256 verifier through a trusted administration connection.
-- Never store the plaintext SUPABASE_BRIDGE_SECRET in this table or in Git.

