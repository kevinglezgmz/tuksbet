const { Db, Collection, Document } = require('mongodb');

/** @type { Db } */
let database = undefined;

class Database {
  /** @type { string } */
  collectionName;
  /** @type { Collection<Document> } */
  collection;

  /**
   * Sets the database singleton instance to access the different collections in the database.
   * @param { Db } db
   */
  static setDatabase(db) {
    database = db;
  }

  /**
   * Returns a database model instance for the selected collection. The
   * @param { string } collectionName
   */
  constructor(collectionName) {
    if (!database) {
      throw 'Can not connect to ' + collectionName + ' because there is no database!';
    }
    this.collectionName = collectionName;
    this.collection = database.collection(collectionName);
  }

  find(query, options) {
    return this.collection.find(query, options);
  }

  findOne(query, options) {
    return this.collection.findOne(query, options);
  }

  insertOne(doc) {
    return this.collection.insertOne(doc);
  }

  insertMany(...docs) {
    return this.collection.insertMany(docs);
  }

  insertOrUpdateOne(query, updateOperations, options) {
    if (typeof options !== 'object') {
      options = {};
    }
    options['upsert'] = true;
    return this.updateOne(query, updateOperations, options);
  }

  updateOne(query, updateOperations, options) {
    return this.collection.updateOne(query, updateOperations, options);
  }

  updateMany(query, updateOperations, options) {
    return this.collection.updateMany(query, updateOperations, options);
  }

  replace(query, replacement) {
    return this.collection.replaceOne(query, replacement);
  }

  deleteOne(query) {
    return this.collection.deleteOne(query);
  }

  deleteMany(query) {
    return this.collection.deleteMany(query);
  }

  findAggregate(query) {
    return this.collection.aggregate(query);
  }
}

module.exports = Database;
