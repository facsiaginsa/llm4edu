const { embedding } = require("../../loaders/langchain")

let sendEmbedding = async (texts) => {
    return await embedding.embedDocuments(texts)
}

module.exports = {
    sendEmbedding,
}