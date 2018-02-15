import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet'; 
import graphqlHTTP from 'express-graphql';
import { Schema } from './data/schema';
import { url } from './mongoose/connectionConfig';

import Phone from './mongoose/phone';

const GRAPHQL_PORT = process.env.PORT || 8080;

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
    [SERVER] GraphQL Server is now running on port ${GRAPHQL_PORT}
  `
  )
);

app.listen(GRAPHQL_PORT, () => console.log(
  `
    [SERVER] GraphQL started...
    [SERVER] Waiting for MongoDB connection...
  `
));