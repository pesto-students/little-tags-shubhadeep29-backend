const config = require('../config/config');
const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { v4: uuidv4 } = require('uuid');
const authorize = require('../middleware/auth');
const Role = require('../middleware/roles');

router.put('/', authorize([Role.Admin]), async function (req, res, next) {
  let params = req.body;
  
  //all validations
  if(!params.categoryId) {
    return res.status(400).json({"status": "error", "message": "Category required."});
  }
  if(!params.subcategoryId) {
    return res.status(400).json({"status": "error", "message": "Subcategory required."});
  }
  if(!params.name) {
    return res.status(400).json({"status": "error", "message": "Name required."});
  }
  if(!params.description) {
    return res.status(400).json({"status": "error", "message": "Description required."});
  }
  if(!params.price) {
    return res.status(400).json({"status": "error", "message": "Price required."});
  }
  if(!params.price) {
    return res.status(400).json({"status": "error", "message": "Price required."});
  } 

  if(params.id){
    const data = {...params};
    delete data.id;
    const user = await Product.update({where: 'User', data: data});
    return res.status(200).json({status:"success", message: "Product updated successfully."});
  } else {
    params.id = uuidv4();
    const user = await Product.create(params);
    return res.status(201).json({status:"success", message: "Product added successfully."});
  }
});

router.get('/', authorize([Role.Admin]), async function (req, res, next) {
  const products = await Product.search({});
  return res.status(200).json({status:"success", items: products});
});

router.get('/search/:search', async function (req, res, next) {
  const products = await Product.suggestions({text: req.params.search});
  return res.status(200).json({status:"success", items: products});
});

router.get('/:id', async function (req, res, next) {
  const products = await Product.search({id: req.params.id});
  if(products.length > 0){
    return res.status(200).json({status:"success", items: products[0]});
  } else {
    return res.status(404).json({status:"error", message: "Product not found."});
  }
});

router.post('/search', async function (req, res, next) {
  const params = req.body;
  const products = await Product.commonSearch(params);
  return res.status(200).json({status:"success", items: products});
});

router.all("*", function(req, res, next){
  return res.status(404).json({status:"error", message: "Not found."});
});

module.exports = router;