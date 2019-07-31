-- to run 
-- sudo su postgres
-- pqsl -d postgres -f db_setup.sql

CREATE DATABASE spots_db;
create user test_user with encrypted password 'testpass';
grant all privileges on database spots_db to test_user;