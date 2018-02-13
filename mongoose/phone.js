import mongoose, { Schema } from 'mongoose';

const phoneSchema = new Schema({
  image: String,
  model: String,
}, {collection:"phones"});

const Phone = mongoose.model('Phone', phoneSchema);

export default Phone;