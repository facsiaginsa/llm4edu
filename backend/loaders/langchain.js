let { ChatBedrockConverse, BedrockEmbeddings } = require("@langchain/aws");
const { AWS_BEDROCK_MODEL_CONVERSE, AWS_REGION_CONVERSE, AWS_SECRET_KEY, AWS_ACCESS_KEY, AWS_BEDROCK_MODEL_EMBEDDING, AWS_REGION_EMBEDDING } = require("../configs");

const converse = new ChatBedrockConverse({
    region: AWS_REGION_CONVERSE,
    model: AWS_BEDROCK_MODEL_CONVERSE,
    temperature: 0.4,
    topP: 0.85,
    maxTokens: (process.env.NODE_ENV !== "production") ? 512 : undefined,
    maxRetries: 2,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
    },
});

const embedding = new BedrockEmbeddings({
    region: AWS_REGION_EMBEDDING,
    model: AWS_BEDROCK_MODEL_EMBEDDING,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
    },
})


module.exports = {
    converse,
    embedding
}