const { MONGO_DATABASE } = require("../../configs")
const { collectionWithVector } = require("../../loaders/langchain")
const { mongoClient } = require("../../loaders/mongodb")
const { converse } = require("../../loaders/langchain")

//let collection = mongoClient.db(MONGO_DATABASE).collection("paper")

let insertDocumentVector = async (vectors, documents) => {
    let index = await collectionWithVector(collection)
    return await index.addVectors(vectors, documents)
}
let sendBrainstorm = async (conversation) => {
    return await converse.invoke(conversation)
}

/**
 * Create other models here
 */

module.exports = {
    insertDocumentVector,
    sendBrainstorm
}

