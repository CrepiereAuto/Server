'use strict'

var gulp = require('./gulpfile')

var Updater = {
  soft: function (callback) {
    gulp.start('soft', function () {
      callback()
    })
  }
  server: function () {
    
  }
}

module.exports = Updater
