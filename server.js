const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); 
const graphqlHTTP = require('express-graphql');
const Schema = require('./data/schema');
const url = require('./mongoose/connectionConfig');

const Phone = require('./mongoose/phone');

const EXPRESS_PORT = process.env.PORT || 8080;

mongoose.connect(url);

const app = express();
const db = mongoose.connection;

app.use(cors());

app.use(helmet());

app.use('/graphql', graphqlHTTP({
  schema: Schema,
  graphiql: true
}));

db.on('error', () => console.log(
  `
    [ERROR] Failed to establish connection to MongoDB.
  `
  )
);

db.once('open', () => console.log(
  `
    [SERVER] Connected to MongoDB
    [SERVER] GraphQL Server is now running on port ${EXPRESS_PORT}
  `
  )
);

app.listen(EXPRESS_PORT, () => console.log(
  `
    [SERVER] GraphQL started...
    [SERVER] Waiting for MongoDB connection...
  `
));