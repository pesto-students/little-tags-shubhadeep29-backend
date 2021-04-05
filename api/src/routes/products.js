const config = require('../config/config');
const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { v4: uuidv4 } = require('uuid');
const authorize = require('../middleware/auth');
const Role = require('../middleware/roles');
const AWS = require('aws-sdk');
const S3 = new AWS.S3({region: config.region});

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
  const products = await Product.search({status:"active"});
  return res.status(200).json({status:"success", items: products});
});

router.delete('/:id', authorize([Role.Admin]), async function (req, res, next) {
  const products = await Product.delete({where: {id: req.params.id}, data: {status:"delete"}});
  console.log(products)
  if(products === 0){
    return res.status(404).json({status:"error", message: "Product not found."});
  }
  return res.status(200).json({status:"success", message: "Product deleted successfully."});
});

router.put('/images', authorize([Role.Admin]), async function (req, res, next) {
  const productImage = req.files.product;

  if(productImage.mimetype !== 'image/jpeg' && productImage.mimetype !== 'image/png' & productImage.mimetype !== 'image/webp'){
    return res.status(400).json({status:"error", message: "Only jpeg/png/webp files allowed."});
  }

  var S3Key = "products/"+productImage.name;
  var FileURL = config.CloudFront+S3Key;
  S3.putObject({
    Body: productImage.data,
    Key: S3Key,
    ContentType: productImage.mimetype,
    Bucket: config.S3Bucket
  }, function(err, data) { 
    if(err){
      return res.status(400).json({status:"error", message: err});  
    }
    return res.status(201).json({status:"success", url: FileURL});
  })
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