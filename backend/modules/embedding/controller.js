const { createPaperVector } = require("./service")

module.exports = function (app, opts, done) {
    app.post('/', async (req, res) => {
        let { documents } = req.body

        let [ err, result ] = await createPaperVector(documents)

        if (err) return res.status(err.code).send({
            message: err.message
        })

        return res.status(200).send({
            message: result
        })
    })

    done()
}