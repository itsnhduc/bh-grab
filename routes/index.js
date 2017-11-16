var express = require('express')
var router = express.Router()
var fetch = require('node-fetch')
var resolveRedirect = require('resolve-redirect')

function getDownloadLink (link, res) {
  if (link) {
    fetch(link).then(function (linkRes) {
      return linkRes.text()
    }).then(function (htmlText) {
      var downloadLink = htmlText.match(/http.*get_file.*.mp4/)[0]
      var downloadName = htmlText.match(/(h2).*(h2)/)[0].slice(3, -4)
      resolveRedirect(downloadLink).then(finalDlLink => {
        res.render('index', { downloadLink: finalDlLink, downloadName: downloadName })
      })
    })
  } else {
    res.render('index', { downloadLink: '' })
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  getDownloadLink(req.query.link, res)
})

module.exports = router
