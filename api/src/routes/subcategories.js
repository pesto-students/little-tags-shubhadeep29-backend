const config = require('../config/config');
const express = require('express');
const router = express.Router();
const SubCategory = require('../models/subcategory');


router.get('/:id', async function (req, res, next) {
  const subcategories = await SubCategory.search({categoryId: req.params.id, status: 'active'});
  return res.status(200).json({status:"success", items: subcategories});
});

router.all("*", function(req, res, next){
  return res.status(404).json({status:"error", message: "Not found."});
});

module.exports = router;