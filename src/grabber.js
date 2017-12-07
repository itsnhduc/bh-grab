var fetch = require('node-fetch')
var cheerio = require('cheerio')
var resolveRedirect = require('resolve-redirect')

var genInfo = require('./info-model')

var grabBh = function (link, res) {
  fetch(link)
    .then(function (linkRes) { return linkRes.text() })
    .then(function (htmlText) {
      var downloadLink = htmlText.match(/http.*?get_file.*?.mp4/)[0]
      resolveRedirect(downloadLink)
        .then(function (url) {
          res.redirect(url)
        })
    })
    .catch(function (reason) {
      console.log(reason)
      res.render('index', genInfo())
    })
}

var listPh = function (searchQuery, res) {
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

module.exports = { grabBh, listPh }