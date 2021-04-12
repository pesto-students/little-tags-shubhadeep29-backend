const config = require('../config/config');
const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist');
const Product = require('../models/product');
const { v4: uuidv4 } = require('uuid');
const authorize = require('../middleware/auth');
const Role = require('../middleware/roles');


router.post('/', authorize([Role.User]), async function (req, res, next) {
  const params = req.body;

  if(!params.productId) {
    return res.status(400).json({"status": "error", "message": "Product id required."});
  }

  params.userId = req.user.id;
  params.id = uuidv4();
  const wishlist = await Wishlist.create(params);
  return res.status(200).json({status:"success", message: "Added to wishlist."});
});

router.get('/', authorize([Role.User]), async function (req, res, next) {
  let wishlist = await Wishlist.search({userId: req.user.id, status: "active"});
  let products = [];
  if(wishlist.length > 0){
    const ids = wishlist.map(wish => wish.productId)
    products = await Product.searchByIds({column: "id", operator: "IN", value: ids});  
  }
  return res.status(200).json({status:"success", items: products});
});

router.all("*", function(req, res, next){
  return res.status(404).json({status:"error", message: "Not found."});
});

module.exports = router;