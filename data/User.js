class User {
  constructor(userId) {
    console.log(`[User.js] Constructing a new User with userId: ${userId}`);
    this.id = userId; // This will be used by GraphQL.
    this.userId = userId; // This will be used by Database.
    this.phones = [];
  }

  /**
   * This function will be called by Database.js.
   * It inserts a Phone to User.
   */
  addPhone(phone) {
    this.phones.push(phone);
  }

  /**
   * This function will be called by Database.js.
   * It returns the phones of the User.
   */
  getPhones() {
    return this.phones;
  }

  /**
   * This function will be called by Database.js.
   * It removes a phone based on _id.
   */
  removePhoneById(_id) {
    this.phones = this.phones.filter(phone => phone._id !== _id);
    return this.phones;
  }

  /**
   * This function will be called by GraphQL.
   * It updates a phone based on _id.
   */
  updatePhone(_id, phoneModel, phoneImage) {
    this.phones.map(phone => {
      if (phone._id == _id) {
        /**
         * Only update values if they are not empty.
         */
        phoneModel.length > 0 ? phone.model = phoneModel : false;
        phoneImage.length > 0 ? phone.image = phoneImage : false;
      }
    });
    return this.phones;
  }
}

export default User;
