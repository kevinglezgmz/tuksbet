let database;

class Database {
  collectionName;
  collection;

  static setDatabase(db) {
    database = db;
  }

  constructor(collectionName) {
    this.collectionName = collectionName;
    this.collection = database.collection(collectionName);
  }

  findOne(filters) {
    return this.collection.findOne(filters);
  }
}

module.exports = Database;
