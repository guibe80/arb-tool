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
      coin: coin,
      data: 'htmlData',
      jsontbl: JSON.stringify(table)
    })
  }, function (error) {
    console.log(error)
  })
})
  
router.get('/:coin/:base-:quote', function (req, res, next) {
  var coin = req.params.coin
  var base = req.params.base
  var quote = req.params.quote
  var pair = base + '/' + quote
  var JSONCoinData, table
  
  console.log(coin + ' for quoting ' + pair)
  
  var CoinData = coinmarket.getCoinData(coin)
  CoinData.then(function (data) {
    console.log('Initialized user details')
    JSONCoinData = coinmarket.updatedData(data)
    JSONCoinData = coinmarket.volumeGreaterThan(JSONCoinData, 1000)
    JSONCoinData = coinmarket.groupByPair(JSONCoinData)
    JSONCoinData = coinmarket.removeSingleData(JSONCoinData, 1)
    JSONCoinData = coinmarket.pairData(JSONCoinData, pair)

    // Use user details from here
    // console.log(JSONCoinData[0])
    table = JSONCoinData
    res.render('pair_details', {
      coin: coin,
      data: 'htmlData',
      jsontbl: JSON.stringify(table)
    })
  }, function (error) {
    console.log(error)
  })

})

module.exports = router
