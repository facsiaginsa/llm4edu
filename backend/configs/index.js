require("dotenv").config()

module.exports = {
    PORT: process.env.PORT,
    IP_BIND: process.env.IP_BIND,
    MONGO_CONN_STRING: process.env.MONGO_CONN_STRING,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_BEDROCK_MODEL: process.env.AWS_BEDROCK_MODEL
}