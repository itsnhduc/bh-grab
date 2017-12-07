var express = require('express')
var router = express.Router()

var grabber = require('../src/grabber')
var genInfo = require('../src/info-model')

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.query.link) {
    grabber.grabBh(req.query.link, res)
  } else if (req.query.search) {
    grabber.listPh(req.query.search, res)
  } else {
    res.render('index', genInfo())
  }
})

module.exports = router
