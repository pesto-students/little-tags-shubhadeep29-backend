const config = require('./src/config');
const http = require('https');
const app = require('./src/app');

app.listen(config.port, () => {
  console.log("Server running on port: " + config.port);
});
