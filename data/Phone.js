class Phone {
  constructor(phoneId, model, image) {
    console.log(`[Phone.js] Constructing a new Phone with phoneId: ${phoneId}`);
    this.id = phoneId; // This will be used by GraphQL.
    this.phoneId = phoneId; // This will be used by Database.
    this.model = model;
    this.image = image;
  }
}

export default Phone;
