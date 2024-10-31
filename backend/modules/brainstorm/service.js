const { requestEmbedding } = require("../embedding/service")
const { insertDocumentVector } = require("./model")

let createBrainstormTrainData = async (documents) => {
    try {

        let texts = []
        // document need to be formatted 
        let newDocuments = []
        for await ( document of documents ) {
            let content = `title: ${document.title}\nabstract: ${document.abstract}\nkeyword: ${document.keyword}`
            texts.push(content)
            document.content = content
            newDocuments.push({
                metadata: document
            })
        }

        let [ err, vectors ] = await requestEmbedding(texts)

        if (err) return [ err, null ]

        let result = await insertDocumentVector(vectors, newDocuments)

        return [ null, "Insert " + result.length + " Document(s) wirh Vector success" ]
    } catch (error) {
        console.log(error)
        return [{ code: 500, message: "There is an error in the server.."}, null]
    }
}

/**
 * Create other services here
 */

module.exports = {
    createBrainstormTrainData
}