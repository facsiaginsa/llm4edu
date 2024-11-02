const { sendConversation } = require("./model")

let createConversation = async (text) => {
    try {

        let formattedMessage = [
            ["system", "You are a helpful assistant that rephrase sentence to be more academic tone"],
            ["human", text]
        ]

        let results = await sendConversation(formattedMessage)
        
        return [ null, results]
    } catch (error) {
        console.log("error", error);
    }
    
}

module.exports = {
    createConversation
}