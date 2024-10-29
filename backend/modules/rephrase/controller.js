const { createConversation } = require("./service")

module.exports = function (app, opts, done) {
    app.get("/", async (req, res) => {

    })

    app.post("/", async (req, res) => {
        let { conversation } = req.body

        /**
         *   {
         *      "conversation": [
         *          ["human", "Apple has many benefit, such as alot of vitamin, and make you healty. They say eat 1 apple a day keeps doctor away"]
         *      ]
         *   }
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