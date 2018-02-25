var express = require('express')
// var cheerio = require('cheerio')
// var request = require('request')
// var numeral = require('numeral')
var coinmarket = require('../lib/coinmarket.js')
// var tabletojson = require('tabletojson')
// var d3 = require('d3')
var router = express.Router()

/* GET users listing. */
router.get('/', function (req, res, next) {
  /*  res.send('respond with a resource'); */

  var JSONCoinData, table
  var coin = 'litecoin'

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
})

module.exports = router
