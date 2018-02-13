import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';
import { printSchema } from 'graphql';
import { Schema } from './data/schema';
import { url } from './mongoose/connectionConfig';

import Phone from './mongoose/phone';

const GRAPHQL_PORT = process.env.PORT || 8080;

mongoose.connect(url);

const app = express();
const db = mongoose.connection;

app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema: Schema,
  graphiql: true
}));

app.use('/savePhone', (req,res) => {
  const phone = new Phone({
   image: "test.jpg",
   model: "Italo Bosta",
  });

  phone.save((err, result) => {
    if (err) {
      console.log(`[ERROR] Failed to save a Phone. Error message: ${err}`);
    }

    console.log(`[SERVER] Saved a new Phone: ${phone}`);
    res.redirect('/');
  });
});


db.on('error', () => console.log(
  `
    [ERROR] Failed to establish connection to MongoDB
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