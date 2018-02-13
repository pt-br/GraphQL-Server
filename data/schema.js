import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  connectionFromPromisedArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import Database from './Database';
const database = new Database;

import MongoPhone from '../mongoose/phone';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    var { type, id } = fromGlobalId(globalId);
    if (type === 'User') {
      return database.getUser();
    } else {
      return null;
    }
  },

  (obj) => {
    if (obj instanceof User)  {
      return UserType;
    } else {
      return null;
    }
  }
);

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User'),
    userId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (obj) => obj.userId,
    },
    phones: {
      type: phoneConnection,
      args: connectionArgs,
      resolve: (_, args) => connectionFromPromisedArray(MongoPhone.find({}, (err, phones) => phones), args),
    },
  }),
  interfaces: [nodeInterface],
});

const PhoneType = new GraphQLObjectType({
  name: 'Phone',
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    model: {
      type: new GraphQLNonNull(GraphQLString),
    },
    image: {
      type: GraphQLString,
    },
  }),
});

/**
 * Define a connection type to connect Phones with Users
 */
const { connectionType: phoneConnection } =
  connectionDefinitions({ name: 'Phone', nodeType: PhoneType });

const AddPhoneMutation = mutationWithClientMutationId({
  name: 'AddPhone',
  inputFields: {
    model: {
      type: new GraphQLNonNull(GraphQLString),
    },
    image: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    viewer: {
      type: UserType,
      resolve: () => database.getUser(),
    },
  },
  mutateAndGetPayload: ({ model, image }) => {
    const newPhone = database.insertPhone(model, image);
    return newPhone;
  },
});

const RemovePhoneMutation = mutationWithClientMutationId({
  name: 'RemovePhone',
  inputFields: {
    phoneId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    viewer: {
      type: UserType,
      resolve: () => database.getUser(),
    },
  },
  mutateAndGetPayload: ({ phoneId }) => {
    const remainingPhones = database.removePhoneById(phoneId);
    return remainingPhones;
  },
});

const UpdatePhoneMutation = mutationWithClientMutationId({
  name: 'UpdatePhone',
  inputFields: {
    phoneId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    phoneModel: {
      type: GraphQLString,
    },
    phoneImage: {
      type: GraphQLString,
    },
  },
  outputFields: {
    viewer: {
      type: UserType,
      resolve: () => database.getUser(),
    },
  },
  mutateAndGetPayload: ({ phoneId, phoneModel, phoneImage }) => {
    const updatedPhones = database.updatePhone(phoneId, phoneModel, phoneImage);
    return updatedPhones;
  },
});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const Root = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: UserType,
      resolve: () => database.getUser(),
    },
  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addPhone: AddPhoneMutation,
    removePhone: RemovePhoneMutation,
    updatePhone: UpdatePhoneMutation,
  }),
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const Schema = new GraphQLSchema({
  query: Root,
  mutation: Mutation,
});
