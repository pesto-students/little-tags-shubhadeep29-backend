const config = require('./src/config');
const http = require('http');
const app = require('./src/app');
const server = http.createServer(app);

server.listen(config.port, () => {
  console.log("http://localhost:" + config.port);
});
