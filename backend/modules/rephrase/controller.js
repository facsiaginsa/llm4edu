const { createConversation } = require("./service")

module.exports = function (app, opts, done) {
    app.get("/", async (req, res) => {

    })

    app.post("/", async (req, res) => {
        let { conversation } = req.body

        /**
         * {
         *   "conversation": [{
         *       "role": "user",
         *       "content": [{
         *           "text": "Describe the purpose of a 'hello world' program in one line."
         *       }]
         *   }]
         *  }
         */

        if ( conversation.length < 1 ) return res.status(400).send({
            message: "conversation must be an array of object"
        })
        let [ err, result ] = await createConversation(conversation)
        if (err) return res.status(500).send({
            message: "There is an error"
        })

        return res.status(200).send({
            message: result
        })
    })

    done()
}