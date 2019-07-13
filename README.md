# spots_service

Backend for the spots project

## Setup:
1. [Install postgresql](https://tecadmin.net/install-postgresql-server-on-ubuntu/) 
2. [Install pgadmin4](https://tecadmin.net/install-pgadmin4-on-ubuntu/)
3. [Create DB](https://medium.com/coding-blocks/creating-user-database-and-adding-access-on-postgresql-8bfcd2f4a91e)
4. [Install NodeJS](https://linuxize.com/post/how-to-install-node-js-on-ubuntu-18.04/)
5. In a terminal in the root of this project run ```npm install```
6. Create the database schema run ```npx sequelize-cli db:migrate```
7. To seed the database with sample data run ```npx sequelize-cli db:seed```
	