const { ConverseStreamCommand, model } = require("../../loaders/bedrock")
const { sendConversation } = require("./model")

let createConversation = async (conversation) => {
    try {

        let command = new ConverseStreamCommand({
            modelId: model,
            messages: conversation,
            inferenceConfig: {
                maxTokens: 512, 
                temperature: 0.5, 
                topP: 0.9
            }
        })
    
        let result = await sendConversation(command)
        

        for await (const item of result.stream) {
            if (item.contentBlockDelta) {
                process.stdout.write(item.contentBlockDelta.delta?.text);
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