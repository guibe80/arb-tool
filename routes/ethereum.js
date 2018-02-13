var express = require('express')
var cheerio = require('cheerio')
var request = require('request')
var tabletojson = require('tabletojson')
var d3 = require('d3')
var router = express.Router()

/* GET users listing. */
router.get('/', function (req, res, next) {
  /*  res.send('respond with a resource'); */
  var coin = 'ethereum'
  var url = 'https://coinmarketcap.com/currencies/' + coin + '/'
  request(url, function (error, response, html) {
    if (!error) {
      var $ = cheerio.load(html)
      var tableHtml = $('#markets-table').parent().html()
      var tableasjson = tabletojson.convert(tableHtml)
      var market = tableasjson[0]
      tableasjson = JSON.stringify(tableasjson[0])
      var marketByPair = d3.nest()
        .key(function (d) {
          return d.Pair
        })
        .entries(market)
      console.log(JSON.stringify(marketByPair[0].values))
      debugger
      // console.log(tableasjson);
      //      debugger;
      //      console.log($);
    } else {
      console.log('error:', error) // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
      // console.log('body:', body) // Print the HTML for the Google homepage.
      var data = error
    }

    res.render('ethereum', {
      title: coin,
      data: tableHtml,
      jsontbl: JSON.stringify(marketByPair)
    })
  })
})
module.exports = router
