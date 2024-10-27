require("dotenv").config()

module.exports = {
    PORT: process.env.PORT,
    IP_BIND: process.env.IP_BIND,
    MONGO_CONN_STRING: process.env.MONGO_CONN_STRING,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
}