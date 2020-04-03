-- to run 
-- psql -d postgres -f db_setup.sql
create user spotz_user with encrypted password 'spotz';

CREATE DATABASE spotz;
grant all privileges on database spotz to spotz_user;

CREATE DATABASE spotz_test;
grant all privileges on database spotz_test to spotz_user;