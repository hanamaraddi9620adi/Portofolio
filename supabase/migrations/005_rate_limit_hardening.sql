create or replace function public.take_rate_limit(bucket_key text,max_hits integer) returns boolean
language plpgsql security invoker set search_path='' as $$
declare total integer;
begin
 if max_hits<1 or max_hits>10000 or length(bucket_key)<>64 then raise exception 'Invalid rate bucket';end if;
 delete from public.rate_limits where created_at < now()-interval '2 hours';
 insert into public.rate_limits as counters(key) values(bucket_key) on conflict(key) do update set hits=counters.hits+1 returning hits into total;
 return total<=max_hits;
end;$$;
revoke all on function public.take_rate_limit(text,integer) from public,anon,authenticated;
grant execute on function public.take_rate_limit(text,integer) to service_role;

