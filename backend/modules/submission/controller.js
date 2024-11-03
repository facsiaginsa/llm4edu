const { saveDocument } = require("./service")

module.exports = function (app, opts, done) {
    app.post('/', async (req,res) => {
        let data = await req.file()

        let [ err, result ] = await saveDocument(data)

        if (err) return res.status(err.code).send({
            message: err.message
        })

        res.status(200).send({
            data: result
        })
    })

    app.get("/review/:docId", async (req,res) => {

    })

    done()
}