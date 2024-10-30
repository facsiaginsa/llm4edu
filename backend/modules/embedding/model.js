const { embedding } = require("../../loaders/langchain")

let requestEmbedding = async (arrayOfText) => {
    return await embedding.embedDocuments(arrayOfText)
}

module.exports = {
    requestEmbedding
}