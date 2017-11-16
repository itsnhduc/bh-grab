var express = require('express')
var router = express.Router()
var fetch = require('node-fetch')
var resolveRedirect = require('resolve-redirect')

function getDownloadLink (link, res) {
  if (link) {
    fetch(link).then(function (linkRes) {
      return linkRes.text()
    }).then(function (htmlText) {
      dlLink = htmlText.match(/http.*get_file.*.mp4/)[0]
      resolveRedirect(dlLink).then(finalDlLink => {
        res.render('index', { downloadLink: finalDlLink })
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
