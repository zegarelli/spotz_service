-- to run 
-- psql -d postgres -f db_setup.sql
create user test_user with encrypted password 'testpass';

CREATE DATABASE spots_db;
grant all privileges on database spots_db to test_user;

CREATE DATABASE spots_test_db;
grant all privileges on database spots_test_db to test_user;