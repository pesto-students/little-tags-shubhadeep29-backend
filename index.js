const config = require('./src/config');
const app = require('./src/app');

const server = app.listen(config.port, () => {
  console.log(JSON.stringify(server.listeners()))
  console.log("Server running on port: " + config.port);
});
