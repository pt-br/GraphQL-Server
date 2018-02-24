const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema({
  image: String,
  model: String,
}, {collection:"phones"});

const Phone = mongoose.model('Phone', phoneSchema);

module.exports = Phone;