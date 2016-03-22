'use strict'

var gulp = require('./gulpfile')

// var Updater = {
//   soft: function (callback) {
//     gulp.start('soft', function () {
//       callback()
//     })
//   },
//   server: function (callback) {
//     gulp.start('server', function () {
//       callback()
//     })
//   }
// }

var Updater = function (key, callback) {
  gulp.start(key, function () {
    callback()
  })
}

module.exports = Updater
