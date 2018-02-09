import express from 'express';
import graphqlHTTP from 'express-graphql';
import { printSchema } from 'graphql';
import { Schema } from './data/schema';

const app = express();

const GRAPHQL_PORT = 8080;

app.use('/graphql', graphqlHTTP({
  schema: Schema,
  graphiql: true
}));

app.get('/schema', (req, res) => {
  res.type('text/plain').send(printSchema(Schema));
});

app.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on port ${GRAPHQL_PORT}`
));