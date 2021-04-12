const tableName = "orders";
const mysql = require('../config/database');
const { User } = require('../middleware/roles');
const UserModel = require('../models/user')

module.exports.search = async function(params){
  return mysql(tableName).where(params).select("id","userId","productId","attributes","price","transactionId","status").orderBy('createdAt');
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

module.exports.dashboard = async function(params){
  const revenue = await mysql(tableName).sum('price as totalRevenue').count("id as totalOrders").where({status: "success"});
  const users = await UserModel.search({role: "User"});
  return {totalUsers: users.length, ...revenue[0]};
}