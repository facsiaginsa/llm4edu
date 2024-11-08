const { sendConversation } = require("./model")

let createConversation = async (text) => {
    try {

        let formattedMessage = [
            ["system", "You are a helpful assistant that rephrase sentence to be more academic tone"],
            ["human", text]
        ]

        let result = await sendConversation(formattedMessage)
        
        return [ null, result]
    } catch (error) {
        console.log("error", error);
        return [ { code: 500, message: "There is error in the server"}, null ]
    }
}

module.exports = {
    createConversation
}