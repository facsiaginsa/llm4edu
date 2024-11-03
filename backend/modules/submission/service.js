const { uploadDoc } = require("./model")
const crypto = require("crypto")

let saveDocument = async (data) => {
    try {
        let docIdSeed = crypto.randomUUID()
        let docId = crypto.createHash("md5").update(docIdSeed).digest("hex")

        let result = await uploadDoc(docId, await data.toBuffer(), {
            name: data.filename,
            mimetype: data.mimetype,
            encoding: data.encoding,
        })

        return [ null, result ]
    } catch (error) {
        console.log(error)
        return [ { code: 500, message: "There is error in the server"}, null ]
    }
}

let reviewDocument = async (docId) => {

}

module.exports = {
    saveDocument,
    reviewDocument
}