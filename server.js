import express from 'express';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';
import { printSchema } from 'graphql';
import { Schema } from './data/schema';

const GRAPHQL_PORT = 8080;

const app = express();

app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema: Schema,
  graphiql: true
}));

app.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on port ${GRAPHQL_PORT}`
));