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
    const {type, id} = fromGlobalId(globalId);
    return data[type][id];
  },

  (obj) => {
    if (obj instanceof User)  {
      return UserType;
    } else if (obj instanceof Phone)  {
      return PhoneType;
    } else {
      return null;
    }
  }
);

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField('User'),
    phones: {
      type: phoneConnection,
      args: connectionArgs,
      resolve: (_, args) => connectionFromPromisedArray(MongoPhone.find({}, (err, phones) => phones), args),
    },
    phoneById: {
      type: PhoneType,
      args: {
        phoneId: {
          type: GraphQLString,
        }
      },
      resolve: (_, args) => MongoPhone.findOne({ '_id': args.phoneId }, (error, phone) => phone),
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
 * Define a connection type to connect Phone with User
 */
const { connectionType: phoneConnection, edgeType: PhoneEdge } =
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
    // viewer: {
    //   type: UserType,
    //   resolve: () => MongoPhone.find({}, (error, phones) => phones),
    // },
    newPhone: {
      type: PhoneType,
      resolve: (payload) => { return { _id: '3243253', model: 'cuck', image: 'fwfwa.jpg'} },
    },
  },
  mutateAndGetPayload: ({ model, image }) => {
    const phone = new MongoPhone({
      image: image,
      model: model,
     });

    phone.save((error, result) => {
      if (error) {
        return error
      }
      
      return phone;
    });
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
      resolve: () => MongoPhone.find({}, (error, phones) => phones),
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
      resolve: () => MongoPhone.find({}, (error, phones) => phones),
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
      resolve: () => true,
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
