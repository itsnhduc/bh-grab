var initialInfo = {
  downloadLink: '',
  downloadName: '',
  listing: []
}

var genInfo = function (opts = {}) {
  var info = {}
  Object.keys(initialInfo).forEach(function (key) {
    info[key] = opts[key] || initialInfo[key]
  })
  return info
}

module.exports = genInfo