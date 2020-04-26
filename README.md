# Spots

_The express backend bit_

## Setup For Development
1. Clone repo
2. Install Postgres ([guide](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-18-04))
3. Change to ubuntu users to the newly created postgres user
```
sudo -i -u postgres
```
4. Enter the database terminal by running:
```
psql
```
5. Check if your computer name user exists by running 
```
\du
```
You should see something that looks like this
```
postgres=# \du
                                   List of roles
 Role name |                         Attributes                         | Member of 
-----------+------------------------------------------------------------+-----------
 martin    |                                                            | {}
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
```
If you don't see your user. (In this case the user "martin" is me, so I'm good) run the following:
```
create user <your computer name> with encrypted password '<some password>';
```
run `"\du"` again to verify you see something similar to above.

6. Run the following command to give yourself the ability to create databases from your user.
```
ALTER ROLE <your username> SUPERUSER CREATEROLE CREATEDB;
```
7. Switch users back to your normal ubuntu user
```
su <username>
```
8. CD into this repo, and run db setup script to setup the testing and development DBs:
```
$ psql -d postgres -f db_create.sql
```

9. Install node packages:
```
$ npm install
```
10. Building tables and seeding data:
```
$ npm run setup-db
```

## Running Server
To run the server simply run:
```
$ npm run start
```

or to run the server during development and have your saved updates automatically restart the server, run:

```
$ npm run dev
```

## Testing
All unit testing is done with [Jest](https://jestjs.io/)
1. **Before you do any testing:** This is a backend service, so you need to have the testing database setup! `npm run db-test-setup` 
1. Simple test to run before committing: `npm run test`
1. Test driven development is highly encouraged. Running `npm run test-watch` will run all of the unit tests that touch files you have changed. It will rerun them every time a change is saved. (Autosave is helpful for immediate feedback)
1. Note that when testing and developing and it is helpful to have two terminals running. One for `$ npm run dev` and the other for `npm run test-watch`