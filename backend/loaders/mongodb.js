const { MongoClient, GridFSBucket } = require('mongodb');
const { MONGO_CONN_STRING } = require('../configs');

const mongoClient = new MongoClient(MONGO_CONN_STRING);

const mongoGridFS = (db, bucket) => {
    return new GridFSBucket(db, {
        bucketName: bucket
    })
}

module.exports = {
    mongoClient,
    mongoGridFS
}