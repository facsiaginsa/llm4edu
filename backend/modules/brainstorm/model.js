const { MONGO_DATABASE } = require("../../configs")
const { collectionWithVector } = require("../../loaders/langchain")
const { mongoClient } = require("../../loaders/mongodb")

let collection = mongoClient.db(MONGO_DATABASE).collection("paper")

let insertDocumentVector = async (vectors, documents) => {
    let index = await collectionWithVector(collection)
    return await index.addVectors(vectors, documents)
}

/**
 * Create other models here
 */

module.exports = {
    insertDocumentVector
}

