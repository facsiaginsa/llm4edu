const { app } = require("./loaders/routes")
const { PORT, IP_BIND } = require('./configs');
const { mongoClient } = require("./loaders/mongodb");

app.listen({
  port: PORT,
  host: IP_BIND
}, async () => {
  console.log("Backend server is running on port", PORT);
  try {
    await mongoClient.connect()
    console.log("Connect to mongoDB success..")
  } catch (error) {
    console.log("Connect to mongoDB error..", error)
  }
  
});