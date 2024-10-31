const { MONGO_DATABASE } = require("../../configs")
const { embedding, collectionWithVector } = require("../../loaders/langchain")
const { mongoClient } = require("../../loaders/mongodb")

let collection = mongoClient.db(MONGO_DATABASE).collection("paper")

let requestEmbedding = async (texts) => {
    return await embedding.embedDocuments(texts)
}

let insertDocumentVector = async (vectors, documents) => {
    let index = await collectionWithVector(collection)
    return await index.addVectors(vectors, documents)
}

module.exports = {
    requestEmbedding,
    insertDocumentVector
}