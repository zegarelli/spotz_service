-- to run 
-- sudo su postgres
-- psql
-- CREATE DATABASE spots_db;
-- \q
-- pqsl -d spots_db -f db_setup.sql

create user test_user with encrypted password 'testpass';
grant all privileges on database spots_db to test_user;