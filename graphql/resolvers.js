const MongoPhone = require("../mongoose/phone");

// Resolvers define the technique for fetching the types in the
// schema.
const resolvers = {
  Query: {
    phones(_, { id }) {
      if (id) {
        return MongoPhone.find({ _id: id }, (error, phone) => phone);
      }

      return MongoPhone.find({}, (err, phones) => phones);
    }
  },
  Mutation: {
    addPhone(_, { model, image }) {
      const phone = new MongoPhone({
        image: image,
        model: model
      });

      return phone.save().then(newPhone => newPhone);
    },
    removePhone(_, { id }) {
      return MongoPhone.findOneAndRemove({ _id: id }).then(
        removedPhone => removedPhone
      );
    },
    updatePhone(_, { id, model, image }) {
      return MongoPhone.findByIdAndUpdate(
        id,
        { $set: { model, image } },
        { new: true },
        (err, updatedPhone) => updatedPhone
      );
    }
  }
};

module.exports = resolvers;
