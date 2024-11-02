const { sendEmbedding } = require("./model")

let requestEmbedding = async (texts) => {
    try {

        let vectors = await sendEmbedding(texts)

        return [ null, vectors ]
    } catch (error) {
        console.log(error)
        return [ { code: 500, message: "There is an error in the server.."}, null ]
    }
}

module.exports = {
    requestEmbedding
}