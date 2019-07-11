const { Client } = require('pg');
const client = new Client({
  //connectionString: process.env.DATABASE_URL, 
  connectionString: 'postgres://gdntyuhdvirils:ef3922477de8141687eedd4dab4a5752d37c57eef490e984d4032485ee2fe85f@ec2-174-129-29-101.compute-1.amazonaws.com:5432/dcd1ekc4g3kmc2',
  ssl: true,
});

client.connect();
module.exports = client;