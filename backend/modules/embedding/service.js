const { requestEmbedding } = require("./model")

let createVector = async (arrayOfText) => {
    try {
        let result = await requestEmbedding(arrayOfText)

        return [ null, result ]
    } catch (error) {
        console.log(error)
        return [{ code: 500, message: "There is an error in the server.."}, null]
    }
}

module.exports = {
    createVector
}