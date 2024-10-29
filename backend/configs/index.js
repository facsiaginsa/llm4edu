require("dotenv").config()

module.exports = {
    PORT: process.env.PORT,
    IP_BIND: process.env.IP_BIND,
    MONGO_CONN_STRING: process.env.MONGO_CONN_STRING,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_REGION_CONVERSE: process.env.AWS_REGION_CONVERSE,
    AWS_BEDROCK_MODEL_CONVERSE: process.env.AWS_BEDROCK_MODEL_CONVERSE,
    AWS_REGION_EMBEDDING: process.env.AWS_REGION_EMBEDDING,
    AWS_BEDROCK_MODEL_EMBEDDING: process.env.AWS_BEDROCK_MODEL_EMBEDDING,
}