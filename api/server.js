const config = require('./src/config/config');
const http = require('http');

const app = require('./src/app');
const server = http.createServer(app);
server.listen(config.port, () => {
  console.log("Server is running on "+config.host+":"+config.port);
});

module.exports = server;