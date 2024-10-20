const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://ali:se3350group15@cluster0.zz3tvcb.mongodb.net/';

const client = new MongoClient(url);

async function connect() {
    try {
      await client.connect();
      console.log('Connected successfully to MongoDB server');
      const db = client.db('group15'); //name of database
  
      return { client, db };
    } catch (err) {
      console.error('Failed to connect to MongoDB', err);
      process.exit(1);
    }
  }
  
  module.exports = { connect };