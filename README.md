# Spots

_The express backend bit_

## Setup For Development
1. Clone repo
2. Install Postgres ([guide](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-18-04))
3. Change to postgres user, CD into the cloned repo, and run db setup script to setup the testing and development DBs:
```
$ psql -d postgres -f db_setup.sql
```

4. Setup node packages:
```
$ npm install
```
5. Building tables and seeding data:
```
$ npm run db-setup
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