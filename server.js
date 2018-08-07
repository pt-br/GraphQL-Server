const { ApolloServer } = require("apollo-server");
const { typeDefs, resolvers } = require("./graphql/schema");

const server = new ApolloServer({ typeDefs, resolvers, cors: true });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
