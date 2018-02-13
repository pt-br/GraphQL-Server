import User from './User';
import Phone from './Phone';
import ShortId from 'shortid';

class Database {
  constructor() {
    console.log('[Database.js] Constructing database');

    const userId = ShortId.generate();
    this.user = new User(userId);

    /**
     * Mock some phones into user
     */
    this.insertPhone('iPhone 6', 'https://goo.gl/ndJdW9');
    this.insertPhone('Galaxy S7', 'https://goo.gl/uanrHM');
  }

  /**
   * This function will be called by GraphQL.
   * It receives a text string, creates a new Phone instance and insert it to
   * our User.
   */
  insertPhone(model, image) {
    const _id = ShortId.generate();
    const phones = this.getPhones();

    const idIsUnique = this.checkUniqueId(_id, phones);

    if (!idIsUnique) {
      this.insertPhone(model, image);
      return false;
    }

    const phone = new Phone(_id, model, image);

    this.user.addPhone(phone);
    return phone;
  }

  /**
   * This function will be called by GraphQL.
   * It returns all phones of the User.
   */
  getPhones() {
    const phones = this.user.getPhones();
    return phones;
  }

  /**
   * This function will be called by Database.js.
   * It checks for unique IDs while creating phone instances.
   */
  checkUniqueId(newId, phones) {
    let isUnique = true;

    if (phones.length > 0) {
      phones.map(({ _id }) => {
        if (_id === newId) {
          isUnique = false;
        }
      }, newId);
    }

    return isUnique;
  }

  /**
   * This function will be called by GraphQL.
   * It returns a phone by _id.
   */
  getPhoneById(_id) {
    const phones = this.user.getPhones();
    const selectedPhone = phones.filter(phone => phone._id == _id);
    return selectedPhone;
  }

  /**
   * This function will be called by GraphQL.
   * It returns the whole User.
   */
  getUser() {
    return this.user;
  }

  /**
   * This function will be called by GraphQL.
   * It removes a phone based on _id.
   */
  removePhoneById(_id) {
    const phones = this.user.removePhoneById(_id);
    return phones;
  }

  /**
   * This function will be called by GraphQL.
   * It updates a phone based on _id.
   */
  updatePhone(_id, phoneModel, phoneImage) {
    const phones = this.user.updatePhone(_id, phoneModel, phoneImage);
    return phones;
  }
}

export default Database;
