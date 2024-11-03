const { MONGO_BUCKET, MONGO_DATABASE } = require("../../configs")
const { converse } = require("../../loaders/langchain")
const { mongoGridFS, mongoClient } = require("../../loaders/mongodb")
const { Readable } = require("stream");

let db = mongoClient.db(MONGO_DATABASE)
let bucket = mongoGridFS(db, MONGO_BUCKET)

let sendConversation = async (conversation, type) => {
    if (type === "invoke") return await converse.stream(conversation)
    if (type === "stream") return await converse.stream(conversation)
}

let uploadDoc = async(docId, docStream, docMetadata) => {

    return new Promise((resolve, reject) => {
        const readableStream = new Readable()
        readableStream.push(docStream)
        readableStream.push(null)

        const uploadStream = bucket.openUploadStream(docId, {
            metadata: docMetadata
        });

        readableStream.pipe(uploadStream);

        uploadStream.on('finish', () => {
            console.log("upload doc " + docId + " success")
            resolve({ docId })
        });

        uploadStream.on('error', (err) => {
            console.log("err", err)
            reject(err)
        });
    })
}

module.exports = {
    sendConversation,
    uploadDoc
}