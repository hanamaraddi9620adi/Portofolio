create extension if not exists pg_cron;
-- Enable the pg_cron extension via Database > Extensions first.
select cron.schedule('portfolio-daily-retention','15 2 * * *',$$
 delete from public.page_views where created_at < now()-interval '90 days';
 delete from public.analytics_events where created_at < now()-interval '90 days';
 delete from public.identified_visitors where created_at < now()-interval '180 days';
 delete from public.contact_submissions where created_at < now()-interval '180 days';
 delete from public.rate_limits where created_at < now()-interval '2 hours';
$$);
