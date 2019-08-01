# Spots

_The express backend bit_

## Setup For Development
1. Clone repo
2. Install Postgres ([guide](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-18-04))
3. CD into the cloned repo, and run db setup scripts:
```
$ pqsl -d postgres -f db_setup.sql
```
4. Setup node packages:
```
$ npm install
```

## Running Server
```$ npm start```