const { createConversation } = require("./service")

module.exports = function (app, opts, done) {
    app.get("/", async (req, res) => {
        let { text } = req.query

        let [ err, result ] = await createConversation(text)

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
                res.raw.write(`data: ${item.content}\n\n`)
            } else {
                res.raw.write(`data: end_turn\n\n`)
            }
        }   
    })

    done()
}