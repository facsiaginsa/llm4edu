let { ChatBedrockConverse, BedrockEmbeddings } = require("@langchain/aws");
let { MongoDBAtlasVectorSearch } = require("@langchain/mongodb")
const { AWS_BEDROCK_MODEL_CONVERSE, AWS_REGION_CONVERSE, AWS_SECRET_KEY, AWS_ACCESS_KEY, AWS_BEDROCK_MODEL_EMBEDDING, AWS_REGION_EMBEDDING } = require("../configs");

const converse = (temperature, topP) => {
    let chatConverse = new ChatBedrockConverse({
        region: AWS_REGION_CONVERSE,
        model: AWS_BEDROCK_MODEL_CONVERSE,
        temperature,
        topP,
        maxRetries: 2,
        credentials: {
            accessKeyId: AWS_ACCESS_KEY,
            secretAccessKey: AWS_SECRET_KEY,
        },
    });
    return chatConverse
}  

const embedding = new BedrockEmbeddings({
    region: AWS_REGION_EMBEDDING,
    model: AWS_BEDROCK_MODEL_EMBEDDING,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
    },
})

const collectionWithVector = async (collection) => {
    let mongoConnector = new MongoDBAtlasVectorSearch(embedding, { 
        collection,
        embeddingKey: "vector",
        textKey: "content"
    })
    return mongoConnector
}

module.exports = {
    converse,
    embedding,
    collectionWithVector
}