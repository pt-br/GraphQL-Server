import express from 'express';
import graphqlHTTP from 'express-graphql';
import { schema } from './data/schema';

const app = express();

const GRAPHQL_PORT = 8080;

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));

app.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on port ${GRAPHQL_PORT}`
));