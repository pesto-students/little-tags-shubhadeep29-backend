const config = require('./config');
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : config.mysql.host,
    user : config.mysql.username,
    password : config.mysql.password,
    database : config.mysql.database,
    port     : config.mysql.port,
    charset  : 'utf8mb4'
  },
  pool: { min: 0, max: 10 }
});

module.exports = knex;