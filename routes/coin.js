var express     = require('express');
var fs          = require('fs');
var cheerio     = require('cheerio');
var cheerioTbl  = require('cheerio-tableparser');
var request     = require('request');
var router      = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next){
  res.redirect('/arbitrage');
})


router.get('/:id', function(req, res, next) {
  /*  res.send('respond with a resource'); */
  // coin = req.param('id');
  coin = req.params.id;
  console.log(coin);
  url = 'https://coinmarketcap.com/currencies/' + coin + '/';
  request(url, function(error, response, html){

    if(!error){
      var $ = cheerio.load(html);
      var $ = $('#markets-table').parent().html();

//      debugger;
//      console.log($);
      var tbl = $;
     }
     else{
       console.log('error:', error); // Print the error if one occurred
       console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
       console.log('body:', body); // Print the HTML for the Google homepage.
       var data = error;
     }

     res.render('coin', { title : coin, data : tbl});
  });
});
module.exports = router;
