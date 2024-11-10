const { converse } = require("../../loaders/langchain")

let sendConversation = async (conversation) => {
    let converseBedrock = converse(0.2, 0.4)
    return await converseBedrock.stream(conversation)
}

module.exports = {
    sendConversation
}