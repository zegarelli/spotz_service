-- to run 
-- sudo su postgres
-- psql
-- pqsl -d spots_db -f db_drop.sql
-- you might need to run it twice

SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'spots_db'
  AND pid <> pg_backend_pid();