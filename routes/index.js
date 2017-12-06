var express = require('express')
var router = express.Router()
var fetch = require('node-fetch')
var resolveRedirect = require('resolve-redirect')
var cheerio = require('cheerio')

var initialInfo = {
  downloadLink: '',
  downloadName: '',
  listing: []
}

function genInfo(opts = {}) {
  var info = {}
  Object.keys(initialInfo).forEach(function (key) {
    info[key] = opts[key] || initialInfo[key]
  })
  return info
}

// function fetchGrabs(link, res) {
//   fetch(link)
//     .then(function (linkRes) { return linkRes.text() })
//     .then(function (htmlText) {
//       var $ = cheerio.load(htmlText)
//       var grabStr = $('#player script').text().match(/\[{\"defaultQuality\"}\]/)
//       var grabs = JSON.parse(grabStr)
//       res.render('index', genInfo({ /* todo */ }))
//     })
// }

function getDownloadLink (link, res) {
  fetch(link)
    .then(function (linkRes) { return linkRes.text() })
    .then(function (htmlText) {
      var downloadLink = htmlText.match(/http.*?get_file.*?.mp4/)[0]
      var downloadName = htmlText.match(/(h2).*(h2)/)[0].slice(3, -4)
      console.log(downloadLink)
      resolveRedirect(downloadLink)
        .then(function (finalDlLink) {
          res.render('index', genInfo({
            downloadLink: downloadLink,
            downloadName: downloadName
          }))
        })
        .catch(function (reason) {
          console.log(reason)
          res.render('index', genInfo())
        })
    })
    .catch(function (reason) {
      console.log(reason)
      res.render('index', genInfo())
    })
}

function getListing(searchQuery, res) {
  link = process.env.SEARCH_PATH + searchQuery
  fetch(link)
    .then(function (linkRes) { return linkRes.text() })
    .then(function (htmlText) {
      var $ = cheerio.load(htmlText)

      var listing = $('.search-video-thumbs .phimage').map(function (i, e) {

        var title = $(e).find('.title a').attr('title')
        var titleShort = title.slice(0, 40) + (title.length > 40 ? '...' : '')
        var thumb = $(e).find('img').data('mediumthumb')
        var vLink = process.env.HOST_PATH + $(e).find('.title a').attr('href')
        var duration = $(e).find('.duration').text()
        var value = $(e).find('.value').text()
        var views = $(e).find('.views var').text()

        return {
          title: title,
          titleShort: titleShort,
          thumb: thumb,
          link: vLink,
          duration: duration,
          value: value,
          views: views,
        }

      })

      res.render('index', genInfo({ listing: listing }))
    })
    .catch(function (reason) {
      console.log(reason)
      res.render('index', genInfo())
    })
}

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.query.link) {
    getDownloadLink(req.query.link, res)
  } else if (req.query.search) {
    getListing(req.query.search, res)
  } else {
    res.render('index', genInfo())
  }
})

module.exports = router
