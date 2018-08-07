const { ApolloServer } = require("apollo-server");
const { typeDefs, resolvers } = require("./graphql/schema");

const mongoose = require("mongoose");
const url = require("./mongoose/connectionConfig");

mongoose.connect(url);
const db = mongoose.connection;

const server = new ApolloServer({ typeDefs, resolvers, cors: true });

server.listen().then(({ url }) => {
  console.log(`
  [SERVER] GraphQL started at ${url}
  [SERVER] Waiting for MongoDB connection...
`);
});

db.on('error', () =>
  console.log(
    `
    [ERROR] Failed to establish connection to MongoDB.
  `
  )
);
db.once('open', () =>
  console.log(
    `
    [SERVER] Connected to MongoDB
    [SERVER] Everything up and running!
  `
  )
);
