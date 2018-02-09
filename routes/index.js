var express = require('express');
var router = express.Router();
var pjson = require('../package.json');

console.log(pjson.version);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Arbitrage tool' , version: pjson.version});
});

module.exports = router;
