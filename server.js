const express = require('express');
const app = express();
const dotenv = require('dotenv');
const config = dotenv.config();

const MongoClient = require('mongodb').MongoClient;
const Database = require('./src/models/database.model.js');

const mainRouter = require('./src/routes');

const PORT = process.env.PORT || 3000;

app.use('/api', mainRouter);

MongoClient.connect(
  process.env.DB_URL,
  {
    useUnifiedTopology: true,
  },
  function (err, client) {
    if (err) {
      console.log('Failed to connect to MongoDB');
    } else {
      console.log('Succesfully connected to MongoDB');
      database = client.db();
      Database.setDatabase(database);

      app.listen(PORT, () => {
        console.log('Server listening on port:', PORT, 'http://localhost:' + PORT);
      });
    }
  }
);
