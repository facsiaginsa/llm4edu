const { MongoClient } = require('mongodb');
const { MONGO_CONN_STRING } = require('../configs');

const mongoClient = new MongoClient(MONGO_CONN_STRING);

module.exports = {
    mongoClient
}