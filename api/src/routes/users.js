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
const Product = require('./products');
const Category = require('../models/category');
const Address = require('../models/address');


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

//Signup user to get jwt token
router.post('/create', async function (req, res, next) {
  let params = req.body;
  
  //all validations
  if(!params.firstName) {
    return res.status(400).json({"status": "error", "message": "First name required."});
  }
  if(!params.lastName) {
    return res.status(400).json({"status": "error", "message": "Last name required."});
  }
  if(!params.email) {
    return res.status(400).json({"status": "error", "message": "Email required."});
  } 
  const users = await User.search({email: params.email});
  if(users.length > 0){
    return res.status(400).json({"status": "error", "message": "Email address already registered."});
  }

  if(!params.password) {
    return res.status(400).json({"status": "error", "message": "Password required."});
  } else if(params.password.length < 8 || params.password.length > 16){
    return res.status(400).json({"status": "error", "message": "Password length must be between 8-16."});
  }
  if(!params.mobile) {
    return res.status(400).json({"status": "error", "message": "Mobile number required."});
  } else if(params.mobile.length > 10){
    return res.status(400).json({"status": "error", "message": "Mobile number should be 10 digits only."});
  }
  if(!params.otp) {
    return res.status(400).json({"status": "error", "message": "OTP required."});
  } else if(params.otp !== '12345'){
    return res.status(400).json({"status": "error", "message": "Invalid otp."});
  }
  
  const salt = bcrypt.genSaltSync(10);
  params.password = bcrypt.hashSync(params.password, salt);
  params.id = uuidv4();
  delete params.otp;

  const user = await User.create(params);
  if(user){
    const token = jwt.sign({id: params.id, role: 'User', firstName: params.firstName, lastname: params.lastname}, config.secret, { expiresIn: config.tokenLife });
    return res.status(201).json({status:"success", message: "User signup successfully.", token: token});
  } else {
    return res.status(401).json({status: "error", message: "There is some error creating user."});
  }
});

router.get('/profile', authorize([Role.User]), async function (req, res, next) {
  const user = await User.search({id: req.user.id});
  delete user[0].password;
  delete user[0].role;
  delete user[0].status;
  delete user[0].updatedAt;
  delete user[0].createdAt;
  return res.status(200).json({status:"success", items: user[0]});
});

router.put('/profile', authorize([Role.User]), async function (req, res, next) {
  const params = req.body;
  if(!params.firstName) {
    return res.status(400).json({"status": "error", "message": "First name required."});
  }
  if(!params.lastName) {
    return res.status(400).json({"status": "error", "message": "Last name required."});
  }
  if(!params.email) {
    return res.status(400).json({"status": "error", "message": "Email required."});
  } 
  if(!params.mobile) {
    return res.status(400).json({"status": "error", "message": "Mobile number required."});
  }
  
  const user = await User.update({where: {id: req.user.id}, data: params});
  const token = jwt.sign({id: req.user.id, role: 'User', firstName: params.firstName, lastname: params.lastname}, config.secret, { expiresIn: config.tokenLife });
  return res.status(200).json({status:"success", token: token, message: "Profile updated successfully."});
});

router.post('/address', authorize([Role.User]), async function (req, res, next) {
  let params = req.body;
  
  //all validations
  if(!params.address1) {
    return res.status(400).json({"status": "error", "message": "Address line 1 required."});
  }
  if(!params.city) {
    return res.status(400).json({"status": "error", "message": "City name required."});
  }
  if(!params.state) {
    return res.status(400).json({"status": "error", "message": "State name required."});
  } 
  if(!params.pincode) {
    return res.status(400).json({"status": "error", "message": "Pincode required."});
  }
  
  params.id = uuidv4();
  params.userId = req.user.id;
  
  const address = await Address.create(params);
  if(address){
    return res.status(201).json({status:"success", message: "Address added successfullly."});
  } else {
    return res.status(401).json({status: "error", message: "There is some error adding address."});
  }
});

router.put('/address', authorize([Role.User]), async function (req, res, next) {
  const params = req.body;
  if(!params.id) {
    return res.status(400).json({"status": "error", "message": "Address id required."});
  }
  if(!params.address1) {
    return res.status(400).json({"status": "error", "message": "Address line 1 required."});
  }
  if(!params.city) {
    return res.status(400).json({"status": "error", "message": "City name required."});
  }
  if(!params.state) {
    return res.status(400).json({"status": "error", "message": "State name required."});
  } 
  if(!params.pincode) {
    return res.status(400).json({"status": "error", "message": "Pincode required."});
  }
  
  const user = await Address.update({where: {id: params.id}, data: params});
  return res.status(200).json({status:"success", message: "Address  updated successfully."});
});

router.get('/address', authorize([Role.User]), async function (req, res, next) {
  const addresses = await Address.search({userId: req.user.id, status: "active"});
  return res.status(200).json({status:"success", items: addresses});
});

router.get('/admin/list', authorize([Role.Admin]), async function (req, res, next) {
  const user = await User.search({role: 'User'});
  return res.status(200).json({status:"success", items: user[0]});
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