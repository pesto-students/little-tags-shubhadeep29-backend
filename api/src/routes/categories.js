const config = require('../config/config');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Category = require('../models/category');
const Util = require('../utilities/util');
const { v4: uuidv4 } = require('uuid');
const authorize = require('../middleware/auth');
const Role = require('../middleware/roles');


router.get('/', async function (req, res, next) {
  const categories = await Category.search({status: 'active'});
  return res.status(200).json({status:"success", items: categories});
});

router.all("*", function(req, res, next){
  return res.status(404).json({status:"error", message: "Not found."});
});

module.exports = router;