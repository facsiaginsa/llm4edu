const { saveDocument, reviewDocument, downloadDocument } = require("./service")

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

    app.get("/download/:docId", async(req, res) => {
        let { docId } = req.params

        let [ err, result ] = await downloadDocument(docId)

        if (err) return res.status(err.code).send({
            message: err.message
        })

        res.status(200).send(result)
    })

    app.get("/review/:docId", async (req,res) => {
        let { docId } = req.params
        let { publisher } = req.query

        let [ err, result ] = await reviewDocument(publisher, docId)

        res.raw.setHeader('Access-Control-Allow-Origin', '*');
        res.raw.setHeader('Access-Control-Allow-Methods', 'GET');
        res.raw.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.raw.setHeader('Content-Type', 'text/event-stream');
        res.raw.setHeader('Cache-Control', 'no-cache');
        res.raw.setHeader('Connection', 'keep-alive');

        if (err) {
            res.raw.write(`data: ${err.message}\n\n`)
            return res.raw.end()
        }

        for await (const item of result) {
            if (!item.response_metadata?.messageStop?.stopReason) {
                // console.log(item)
                process.stdout.write(item.content)
                res.raw.write(`data: ${item.content}\n\n`)
            } else {
                return res.raw.end()
            }
        }   
    })

    done()
}