var express = require('express')
var fs = require('fs')
var cheerio = require('cheerio')
var request = require('request')
var router = express.Router()

/* GET users listing. */
router.get('/', function (req, res, next) {
  /*  res.send('respond with a resource'); */
  var url = 'http://www.imdb.com/title/tt0364725/'

  request(url, function (error, response, html) {
    if (!error) {
      var $ = cheerio.load(html)
      // debugger

      var title, release, rating
      var json = {title: '', release: '', rating: ' '}

      $('.title_wrapper').filter(function () {
        var data = $(this)
        title = data.children().first().text().trim()
        release = data.children().last().children().last().text().trim()
        json.title = title
        json.release = release
      })

      $('.ratingValue').filter(function () {
        var data = $(this)
        rating = data.text().trim()
        json.rating = rating
      })
    }

//  res.render('scrape', {movie: "title"});
    fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
      if (err) {
        console.log('There was an error while writting the file')
      } else {
        console.log('File succesfully written! - Check your directory for the output.json file')
      }
    })

    res.render('scrape', { movie: json.title, released: json.release, rating: json.rating })
  })
})

module.exports = router
