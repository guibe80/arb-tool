var express = require('express')
// var cheerio = require('cheerio')
// var request = require('request')
// var numeral = require('numeral')
var router = express.Router()
// var tabletojson = require('tabletojson')
// var d3 = require('d3')
var coinmarket = require('../lib/coinmarket.js')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.redirect('/arbitrage')
})

router.get('/:id', function (req, res, next) {
  /*  res.send('respond with a resource'); */
  // coin = req.param('id');
  var coin = req.params.id
  var JSONCoinData, table

  var CoinData = coinmarket.getCoinData(coin)
  CoinData.then(function (data) {
    console.log('Initialized user details')
    JSONCoinData = coinmarket.updatedData(data)
    // JSONCoinData = coinmarket.volumeGreaterThan(JSONCoinData, 1000)
    JSONCoinData = coinmarket.groupByPair(JSONCoinData)
    JSONCoinData = coinmarket.removeSingleData(JSONCoinData, 1)

    // Use user details from here
    // console.log(JSONCoinData[0])
    table = JSONCoinData
    res.render('ethereum', {
      title: coin,
      data: 'htmlData',
      jsontbl: JSON.stringify(table)
    })
  }, function (error) {
    console.log(error)
  })

  //
  // console.log(coin)
  // var url = 'https://coinmarketcap.com/currencies/' + coin + '/'
  // request(url, function (error, response, html) {
  //   if (!error) {
  //     /* Extract data from HTML, convert to JSON and group by Pair */
  //     var $ = cheerio.load(html)
  //     var htmlData = $('#markets-table').parent().html()
  //     // console.log(htmlData)
  //     var jsonMarket = tabletojson.convert(htmlData)[0]
  //     for (var i = 0; i < jsonMarket.length; i++) {
  //       jsonMarket[i].Price = numeral(jsonMarket[i].Price)._value
  //       jsonMarket[i]['Volume (24h)'] = numeral(jsonMarket[i]['Volume (24h)'])._value
  //       jsonMarket[i]['Volume (%)'] = numeral(jsonMarket[i]['Volume (%)'])._value
  //       // debugger
  //       console.log(jsonMarket[i].Price, jsonMarket[i]['Volume (24h)'], jsonMarket[i]['Volume (%)'])
  //     }
  //     var marketByPair = d3.nest()
  //       .key(function (d) {
  //         return d.Pair
  //       })
  //       .entries(jsonMarket)
  //     // console.log(JSON.stringify(marketByPair[0].values))
  //     // console.log(tableasjson);
  //     //      debugger;
  //     //      console.log($);
  //   } else {
  //     console.log('error:', error) // Print the error if one occurred
  //     console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
  //     // console.log('body:', body) // Print the HTML for the Google homepage.
  //     var coin = error
  //   }
  //
  //   res.render('ethereum', {
  //     title: coin,
  //     data: htmlData,
  //     jsontbl: JSON.stringify(marketByPair)
  //   })
  // })
})

router.get('/:coin/analyse/:id', function (req, res, next) {
  var coin = req.params.coin
  var id = req.params.id
  console.log(coin + ' ' + id)
  var tbl = coinmarket.coin(coin, 0)
  console.log(tbl)
})

module.exports = router
