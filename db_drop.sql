-- to run 
---psql -d postgres -f db_drop.sql
-- you might need to run it twice (?)

SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'spotz'
  AND pid <> pg_backend_pid();

DROP DATABASE spotz;

SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'spotz_test'
  AND pid <> pg_backend_pid();

DROP DATABASE spotz_test;

DROP USER spotz_user;