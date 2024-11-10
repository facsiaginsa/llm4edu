const { error } = require("console");
const { MONGO_BUCKET, MONGO_DATABASE } = require("../../configs")
const { converse } = require("../../loaders/langchain")
const { mongoGridFS, mongoClient } = require("../../loaders/mongodb")
const { Readable } = require("stream");

let db = mongoClient.db(MONGO_DATABASE)
let bucket = mongoGridFS(db, MONGO_BUCKET)

let sendConversation = async (conversation, type) => {
    let converseBedrock = converse(0.2, 0.4)
    if (type === "invoke") return await converseBedrock.invoke(conversation)
    if (type === "stream") return await converseBedrock.stream(conversation)
}

let getDoc = async (docId) => {
    return new Promise((resolve,reject) => {
        let dataStream = bucket.openDownloadStreamByName(docId)

        let data = []

        dataStream.on("data", chunk => {
            data.push(chunk)
        })

        dataStream.on("end", () => {
            let dataBuffer = Buffer.concat(data)
            resolve(dataBuffer)
        })

        dataStream.on("error", err => {
            reject(error)
        })
    })
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

let deleteDoc = async(docId) => {
    let filesCollection = db.collection("submission_draft.files")
    let chunkCollection = db.collection("submission_draft.chunks")
    let document = await filesCollection.findOne({
        filename: docId
    })

    await filesCollection.deleteOne({
        filename: docId
    })

    await chunkCollection.deleteMany({
        files_id: document._id
    })

    return { message: "file deleted" }
}

module.exports = {
    sendConversation,
    uploadDoc,
    getDoc,
    deleteDoc
}