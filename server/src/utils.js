const { ObjectId } = require('bson');

function getObjectId(stringId) {
  try {
    const objId = ObjectId(stringId);
    return objId;
  } catch {
    return '';
  }
}

module.exports = {
  getObjectId,
};
