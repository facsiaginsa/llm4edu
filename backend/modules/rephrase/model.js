let { client } =  require("../../loaders/bedrock")
const { converse } = require("../../loaders/langchain")

let sendConversation = async (conversation) => {
    return await converse.stream(conversation)
}

module.exports = {
    sendConversation
}