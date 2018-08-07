const { gql } = require('apollo-server');

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  type Phone {
    id: ID! # the ! means that every author object _must_ have an id
    model: String!
    image: String
  }

  # the schema allows the following query:
  type Query {
    phones(id: String): [Phone]
  }

  # this schema allows the following mutation:
  type Mutation {
    addPhone(model: String!, image: String): Phone,
    removePhone(id: String!): Phone,
    updatePhone(id: String!, model: String, image: String): Phone,
  }

  # we need to tell the server which types represent the root query
  # and root mutation types. We call them RootQuery and RootMutation by convention.
  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = typeDefs;