const config = require('../config/config');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Util = require('../utilities/util');
const { v4: uuidv4 } = require('uuid');
const authorize = require('../middleware/auth');
const Role = require('../middleware/roles');
console.log(uuidv4())
//Login user to get jwt token
router.post('/login', async function (req, res, next) {
  let params = req.body;
  
  //all validations
  if(!params.email) {
    return res.status(400).json({"status": "error", "message": "Email required."});
  } 
  if(!params.password) {
    return res.status(400).json({"status": "error", "message": "Password required."});
  } else if(params.password.length < 8 || params.password.length > 16){
    return res.status(400).json({"status": "error", "message": "Password length must be between 8-16."});
  }

  
  const user = await User.search({email: params.email});
  if(user.length === 0){
    return res.status(401).json({status: "error", message: "Unauthorized user! Invalid email or password."});
  }
  
  const isMatched = await bcrypt.compare(params.password, user[0].password)
  
  if(isMatched){
    const token = jwt.sign({id: user[0].id, role: user[0].role, firstName: user[0].firstName, lastname: user[0].lastname}, config.secret, { expiresIn: config.tokenLife });
    return res.status(200).json({status:"success", token: token});
  } else {
    return res.status(401).json({status: "error", message: "Unauthorized user! Invalid username or password."});
  }
});

router.get('/admin/list', authorize([Role.Admin]), async function (req, res, next) {
  const user = await User.search({role: 'User'});
  return res.status(200).json({status:"success", items: user});
});

router.get('/admin/:id', authorize([Role.Admin]), async function (req, res, next) {
  const user = await User.search({id: req.params.id});
  return res.status(200).json({status:"success", items: user[0]});
});

router.put('/admin/:id', authorize([Role.Admin]), async function (req, res, next) {
  const user = await User.update({where: {id: req.params.id}, data: req.body});
  return res.status(200).json({status:"success", message: "User updated successfully."});
});

router.delete('/admin/:id', authorize([Role.Admin]), async function (req, res, next) {
  const user = await User.update({where: {id: req.params.id}, data: {status:'delete'}});
  return res.status(200).json({status:"success", message: "User deleted successfully."});
});

router.all("*", function(req, res, next){
  return res.status(404).json({status:"error", message: "Not found."});
});

module.exports = router;