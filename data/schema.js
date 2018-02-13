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
    if (obj instanceof Phones)  {
      return PhonesType;
    } else {
      return null;
    }
  }
);

const PhonesType = new GraphQLObjectType({
  name: 'Phones',
  fields: () => ({
    id: globalIdField('Phones'),
    phones: {
      type: phoneConnection,
      args: connectionArgs,
      resolve: (_, args) => connectionFromPromisedArray(MongoPhone.find({}, (err, phones) => phones), args),
    }
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
 * Define a connection type to connect Phone with Phones
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
    // allPhones: {
    //   type: PhonesType,
    //   resolve: () => MongoPhone.find({}, (error, phones) => phones),
    // },
    newPhone: {
      type: PhoneType,
      resolve: (payload) => MongoPhone.findOne({ '_id': payload._id }, (error, phone) => phone),
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
    allPhones: {
      type: PhonesType,
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
    allPhones: {
      type: PhonesType,
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
    allPhones: {
      type: PhonesType,
      resolve: () => true,
    },
    phone: {
      type: PhoneType,
      args: {
        phoneId: {
          type: GraphQLString,
        }
      },
      resolve: (_, args) => MongoPhone.findOne({ '_id': args.phoneId }, (error, phone) => phone),
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
