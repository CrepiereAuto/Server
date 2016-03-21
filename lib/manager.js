'use strict'

var debug = require('debug')('manager')
var nedb = require('nedb')
var db = new nedb('data/tokens.db')

class Manager {
  constructor() {
    debug('init')
    this.tokens = {}
    this.clients = {}
    this.keys = {}
    db.loadDatabase()
  }
  start(socket, token){
    debug('start connection')
     if(!token){
       debug('gen token')
       token = genId(16)
       this.tokens[token] = []
       socket.emit('token', token)
     }

     this.clients[socket.id] = token
     var room =  this.tokens[token]

     for(var i in room){
       debug(socket.id+' join '+room[i])
       socket.join(room[i])
     }

    socket.emit('start', true)
  }
  stop(id){
    debug('stop connection')
    delete(this.clients[id])
  }
  open(socket, key){
    var token = this.clients[socket.id]
    var room = 'station-'+token
    debug(token+' open '+room)
    if (this.tokens[token].indexOf(room) == -1){
      this.tokens[token].push(room)
      socket.join(room)
    }
    this.keys[key] = room
    var self = this
    setTimeout(function () {
      if (key in self.keys) {
        debug('linking timeout')
        delete(self.keys[key])
      }
    },15000)
    debug('opening '+room)
  }
  join(socket, key){
    var token = this.clients[socket.id]
    var room = this.keys[key]
    if (room) {
      if (this.tokens[token].indexOf(room) == -1){
        debug(token+' join '+room)
        this.tokens[token].push(room)
        socket.join(room)
        socket.emit('join', true)
        delete(this.keys[key])
      }
    }else {
      debug(token+' can\'t join or already join')
    }
  }
}

module.exports = new Manager;

function genId(size) {
  var possible = "AZERTYUIOPQSDFGHJKLMWXCVBNazertyuiopqsdfghjklmwxcvbn123455679"
  var id = ""
  for(var i=0; i<size; i++){
    id += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return id
}
