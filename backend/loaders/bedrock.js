let { BedrockRuntimeClient, ConverseStreamCommand } = require("@aws-sdk/client-bedrock-runtime")
const { AWS_REGION, AWS_BEDROCK_MODEL, AWS_ACCESS_KEY, AWS_SECRET_KEY } = require("../configs")

let client = new BedrockRuntimeClient({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
    }
})

let model = AWS_BEDROCK_MODEL

module.exports = {
    model,
    client,
    ConverseStreamCommand
}