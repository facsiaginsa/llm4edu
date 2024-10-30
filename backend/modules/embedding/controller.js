const { createVector } = require("./service")

module.exports = function (app, opts, done) {
    app.post('/', async (req, res) => {
        let { title, abstract } = req.body

            let [ err, result ] = await createVector([title, abstract])

        if (err) return res.status(err.code).send({
            message: err.message
        })

        return res.status(200).send({
            message: result
        })
    })

    done()
}