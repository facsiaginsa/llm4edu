module.exports = function (app, opts, done) {
    app.get('/', async (req, res) => {
        return res.status(200).send({
            message: "Backend app is running.."
        })
    })

    done()
}