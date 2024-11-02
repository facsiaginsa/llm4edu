const fastify = require('fastify')
const app = fastify()

app.register(require("@fastify/cors"), { 
    origin: "*"
})

app.register(require("../modules/healthcheck/controller"), {prefix: "/health-check"})
app.register(require("../modules/brainstorm/controller"), { prefix: "/brainstorm" })
app.register(require("../modules/rephrase/controller"), { prefix: "/rephrase" })
app.register(require("../modules/submission/controller"), { prefix: "/submission" })
app.register(require("../modules/summarize/controller"), { prefix: "/summarize" })

module.exports = {
    app
}