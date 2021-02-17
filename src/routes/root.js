var config = require("./../config")
var express = require('express');
var router = express.Router();


router.get("/__test", (req, res, next) => {
  res.status(200).json({status: "success", message: "Hello World!"});
});

module.exports = router;