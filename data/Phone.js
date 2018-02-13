class Phone {
  constructor(phoneId, model, image) {
    console.log(`[Phone.js] Constructing a new Phone with phoneId: ${phoneId}`);
    this._id = phoneId; // This will be used by GraphQL.
    this.model = model;
    this.image = image;
  }
}

export default Phone;
