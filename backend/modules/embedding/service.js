const { requestEmbedding, insertDocumentVector } = require("./model")

let createPaperVector = async (documents) => {
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

        let vectors = await requestEmbedding(texts)

        let result = await insertDocumentVector(vectors, newDocuments)

        return [ null, "Insert " + result.length + " Document(s) wirh Vector success" ]
    } catch (error) {
        console.log(error)
        return [{ code: 500, message: "There is an error in the server.."}, null]
    }
}

module.exports = {
    createPaperVector
}