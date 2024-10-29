const { sendConversation } = require("./model")

let createConversation = async (conversation) => {
    try {
        // let command = new ConverseStreamCommand({
        //     modelId: model,
        //     messages: conversation,
        //     inferenceConfig: {
        //         maxTokens: 512, 
        //         temperature: 0.4, 
        //         topP: 0.85,
        //         topK: 50
        //     }
        // })

        let formattedMessage = [
            ["system", "You are a helpful assistant that rephrase sentence to be more academic tone"],
            ...conversation
        ]

        let results = await sendConversation(formattedMessage)
        for await (const item of results) {

            if (item.content) {
                process.stdout.write(item.content);
            }
        }   

        return [ null, "ok"]
    } catch (error) {
        console.log("error", error);
    }
    
}

module.exports = {
    createConversation
}