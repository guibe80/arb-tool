var cheerio = require('cheerio')
var request = require('request')
var d3 = require('d3')
var numeral = require('numeral')

var JSONCoinData

function getCoinData(coin) {
  // Return new promise
  return new Promise(function (resolve, reject) {
    // Setting URL and headers for request
    var url = 'https://coinmarketcap.com/currencies/' + coin + '/'
    // Do async job
    request.get(url, function (error, response, body) {
      if (!error) {
        /* Extract data from HTML, convert to JSON and group by Pair */
        var $ = cheerio.load(body)
        var result = ''
        // console.log($)
        result = $('#markets-table tbody tr').map(function(i, element) {return {
          id: $(element).find('td:nth-of-type(1)').text().trim(),
          exchange: $(element).find('td:nth-of-type(2)').text().trim(),
          pair: $(element).find('td:nth-of-type(3)').text().trim(),
          pair_link: $(element).find('td:nth-of-type(3) a').attr('href').trim(),
          volume_usd: numeral($(element).find('td:nth-of-type(4) span').attr('data-usd').trim())._value,
          volume_btc: numeral($(element).find('td:nth-of-type(4) span').attr('data-btc').trim())._value,
          volume_nat: numeral($(element).find('td:nth-of-type(4) span').attr('data-native').trim())._value,
          price_usd: numeral($(element).find('td:nth-of-type(5) span').attr('data-usd').trim())._value,
          price_btc: numeral($(element).find('td:nth-of-type(5) span').attr('data-btc').trim())._value,
          price_nat: numeral($(element).find('td:nth-of-type(5) span').attr('data-native').trim())._value,
          volume_percent: numeral($(element).find('td:nth-of-type(6) span').attr('data-format-value').trim())._value,
          updated: $(element).find('td:nth-of-type(7)').text().trim()
        }}).get()
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

function groupByPair(jsonData) {
  // Filters data by pairs XXX/YYY
  return d3.nest()
    .key(function (group) {
      return group.pair
    })
    .entries(jsonData)
    .map(function (group) {
      return {
        pair: group.key,
        data: group.values
      }
    })
}

function updatedData(jsonData) {
  // Filters only recent data
  return jsonData.filter(function (obj) {
    if (obj.updated === 'Recently') {
      return obj
    }
  })
}

function removeSingleData(jsonData, element) {
  // Filters only recent data
  return jsonData.filter(function (obj) {
    if (obj.data.length > element) {
      return obj
    }
  })
}

function volumeGreaterThan(jsonData, value) {
  // Filters only recent data
  return jsonData.filter(function (obj) {
    if (obj.volume_usd > value) {
      return obj
    }
  })
}

function main() {
  var args = []
  var coin, groupBy
  var hrstart = process.hrtime()
  var hrend = process.hrtime(hrstart)

  process.argv.forEach(function (val, index, array) {
    args[index] = val
  })
  coin = args[2]
  groupBy = args[3]

  var CoinData = getCoinData(coin, groupBy)
  CoinData.then(function (data) {
    console.log('Initialized user details')
    JSONCoinData = updatedData(data)
    JSONCoinData = volumeGreaterThan(JSONCoinData, 1000000)
    console.log('A total of ' + JSONCoinData.length + ' were found')
    JSONCoinData = groupByPair(JSONCoinData)
    JSONCoinData = removeSingleData(JSONCoinData, 1)
    console.log(JSON.stringify(JSONCoinData))

    // delete JSONCoinData.pair_link

    // Use user details from here
    // console.log(JSONCoinData)
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
  }, function (error) {
    console.log(error)
  })
}

//main()

module.exports.getCoinData = getCoinData
module.exports.groupByPair = groupByPair
module.exports.updatedData = updatedData
module.exports.removeSingleData = removeSingleData
module.exports.volumeGreaterThan = volumeGreaterThan