const tableName = "users";
const mysql = require('../config/database');

module.exports.search = async function(params){
  return mysql(tableName).where(params).select();
}

module.exports.create = async function(params){
  return mysql(tableName).insert(params);
}

module.exports.update = async function(params){
  return mysql(tableName).where(params.where).update(params.data)
}

module.exports.delete = async function(params){
  return mysql(tableName).where(params.where).update(params.data)
}