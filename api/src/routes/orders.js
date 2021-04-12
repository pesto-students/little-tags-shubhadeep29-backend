const config = require('../config/config');
const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const authorize = require('../middleware/auth');
const Role = require('../middleware/roles');
const Razorpay = require('razorpay');



router.post('/', authorize([Role.User]), async function (req, res, next) {
  const params = req.body;

  if(!params.price) {
    return res.status(400).json({"status": "error", "message": "Price required."});
  }
  if(!params.productId) {
    return res.status(400).json({"status": "error", "message": "Product id required."});
  }
  if(!params.addressId) {
    return res.status(400).json({"status": "error", "message": "Address id required."});
  }
  if(!params.attributes) {
    return res.status(400).json({"status": "error", "message": "Attributes required."});
  }

  params.id = uuidv4();
  const instance = new Razorpay({
    key_id: config.razorpayKeyId,
    key_secret: config.razorpayKeySecret
  });
  var options = {  
    amount: params.price,  // amount in the smallest currency unit  
    currency: "INR",  
    receipt: params.id
  };
  instance.orders.create(options, async function(err, order) {  
    if(err){
      console.log(err);
      return res.status(400).json({status:"error", message: err});
    }
    console.log(order);
    const orderParams = {
      id: params.id,
      userId: req.user.id,
      price: params.price,
      productId: params.productId,
      attributes: params.attributes,
      transactionId: order.id,
      addressId: params.addressId
    }
    await Order.create(orderParams);
    return res.status(200).json({status:"success", orderId: order.id, message: "Order created successfully."});
  });

  //params.userId = req.user.id;
  //params.id = uuidv4();
  //const wishlist = await Wishlist.create(params);
  //return res.status(200).json({status:"success", message: "Added to wishlist."});
});

router.put('/:id', authorize([Role.User]), async function (req, res, next) {
  const params = req.body;
  if(!params.orderStatus) {
    return res.status(400).json({"status": "error", "message": "Order status required."});
  }

  const order = await Order.search({userId: req.user.id, transactionId: req.params.id});
  if(order.length > 0){
    await Order.update({where: {id: order[0].id}, data: {status: params.orderStatus}});
    return res.status(200).json({status:"success", message: "Order status updated successfully."});
  } else {
    return res.status(400).json({status:"error", message: "Order not found."});
  }
});

router.get("/admin/dashboard", authorize([Role.Admin]), async function(req, res, next){
  const stats = await Order.dashboard();
  return res.status(200).json({status:"success", stats: stats});
});

router.get("/admin/list", authorize([Role.Admin]), async function(req, res, next){
  const orders = await Order.search({});
  let userIds = orders.map(order => order.userId);
  let productIds = orders.map(order => order.productId);

  const users = await User.searchLike({column: "id", operator: "IN", value: userIds});
  let userDetails = [];
  users.forEach(user => {
    userDetails[user.id] = user;
  })
  const products = await Product.searchLike({column: "id", operator: "IN", value: productIds});
  let productDetails = [];
  products.forEach(product => {
    productDetails[product.id] = product;
  });
  console.log(productDetails)
  orders.forEach((order, i) => {
    orders[i].user = userDetails[order.userId];
    orders[i].product = productDetails[order.productId]
  })

  return res.status(200).json({status:"success", items: orders});
});

router.get("/list", authorize([Role.User]), async function(req, res, next){
  const orders = await Order.search({userId: req.user.id});
  let userIds = orders.map(order => order.userId);
  let productIds = orders.map(order => order.productId);

  const users = await User.searchLike({column: "id", operator: "IN", value: userIds});
  let userDetails = [];
  users.forEach(user => {
    userDetails[user.id] = user;
  })
  const products = await Product.searchLike({column: "id", operator: "IN", value: productIds});
  let productDetails = [];
  products.forEach(product => {
    productDetails[product.id] = product;
  });
  console.log(productDetails)
  orders.forEach((order, i) => {
    orders[i].user = userDetails[order.userId];
    orders[i].product = productDetails[order.productId]
  })

  return res.status(200).json({status:"success", items: orders});
});

router.all("*", function(req, res, next){
  return res.status(404).json({status:"error", message: "Not found."});
});

module.exports = router;