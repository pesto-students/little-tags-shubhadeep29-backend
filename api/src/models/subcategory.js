const tableName = "subcategories";
const mysql = require('../config/database');

module.exports.search = async function(params){
  return mysql(tableName).where(params).select("id","name").orderBy('createdAt');
}

module.exports.searchLike = async function(params){
  return mysql(tableName).where(params.column, params.operator, params.value).select("id","name").orderBy('createdAt');
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