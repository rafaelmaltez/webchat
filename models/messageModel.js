const connection = require('./connection');
// const { ObjectId } = require('mongodb');

const create = async (message) => {
  await connection()
    .then((db) => db.collection('messages').insertOne(message));
};

const getAll = async () => {
  const allMessages = await connection()
  .then((db) => db.collection('messages').find().toArray());
  return allMessages;
};

module.exports = {
  create,
  getAll,
};
