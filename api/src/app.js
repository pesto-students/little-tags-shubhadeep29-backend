const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const helmet = require('helmet');
app.use(helmet());
const errorHandler = require('./helper/error-handler');

var fileUpload = require('express-fileupload');
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, //5 MB maxSize
  limitHandler: function(req, res, next){
    return res.status(500).json({status: "error", message: "Image size should be less than equal to 5MB."});
  }
}));

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token');
  res.header('Access-Control-Expose-Headers', 'x-access-token, Authorization');

  if(req.method === "OPTIONS"){
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    return res.status(200).json({});
  }
  next();
});

const users = require('./routes/users');
app.use('/user', users);

const categories = require('./routes/categories');
app.use('/category', categories);

const subcategories = require('./routes/subcategories');
app.use('/subcategory', subcategories);

const products = require('./routes/products');
app.use('/product', products);

app.use(errorHandler);

module.exports = app;
