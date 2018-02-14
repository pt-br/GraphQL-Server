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
    newPhone: {
      type: PhoneType,
      resolve: (payload) => MongoPhone.findOne({ '_id': payload.newPhoneId }, (error, phone) => phone),
    },
  },
  mutateAndGetPayload: ({ model, image }) => {
    const phone = new MongoPhone({
      image: image,
      model: model,
     });

    /**
     * Return the payload to the outputFields
     */
    return phone.save().then(newPhone => ({ newPhoneId: newPhone._id }));
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
    removedPhoneMessage: {
      type: GraphQLString,
      resolve: (payload) => `Phone(id: ${payload.removedPhoneId}) has been removed.`,
    },
    removedPhoneId: {
      type: GraphQLString,
      resolve: (payload) => payload.removedPhoneId,
    },
  },
  mutateAndGetPayload: ({ phoneId }) => {
    /**
     * Return the payload to the outputFields
     */
    return MongoPhone.findOneAndRemove({ '_id': phoneId })
      .then(removedPhone => ({ removedPhoneId: removedPhone._id }));
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
    updatedPhone: {
      type: PhoneType,
      resolve: (payload) => MongoPhone.findOne({ '_id': payload.updatedPhoneId }, (error, phone) => phone),
    },
  },
  mutateAndGetPayload: ({ phoneId, phoneModel, phoneImage }) => {
    /**
     * Return the payload to the outputFields.
     * 
     * Will not return something from the response because when
     * updating objects, the query response from MongoDB doesn't display
     * a updated object, instead, just a success message.
     */
    return MongoPhone.update({ '_id': phoneId }, { model: phoneModel, image: phoneImage})
      .then(() => ({ updatedPhoneId: phoneId })); 
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
