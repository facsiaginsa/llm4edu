let { client } =  require("../../loaders/bedrock")

let sendConversation = async (command) => {
    return await client.send(command)
}

module.exports = {
    sendConversation
}