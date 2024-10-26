const { app } = require("./loaders/routes")
const { PORT, IP_BIND } = require('./configs');

app.listen({
  port: PORT,
  host: IP_BIND
}, () => {
  console.log("Backend server is running on port", PORT);
});