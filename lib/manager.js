'use strict';

var debug = require('debug')('manager');
var nedb = require('nedb');
var db = new nedb({filename: 'data/tokens.db', autoload: true});

class Manager {
  constructor() {
    debug('init');
    this.clients = {};
    this.keys = {};
  }
  start(socket, token){
     if(!token){
       token = genId(16);
       db.insert({_id: token, stations: []}, function (err, newDoc) {
         if (err) {
           debug(err);
         }
       });
       debug("start with new token")
       socket.emit('start', token);
     }else {
       debug(token);
       db.findOne({_id: token}, function (err, doc) {
         for(var i in doc.stations){
           debug(token+' join '+doc.stations[i]);
           socket.join(doc.stations[i]);
         }
         debug("start with existing token")
         socket.emit('start', token);
       });
     }
     this.clients[socket.id] = token;
  }
  stop(id){
    debug('stop connection');
    delete(this.clients[id]);
  }
  open(socket, key){
    var token = this.clients[socket.id];
    var room = 'station-'+token;
    debug(token+' open '+room);
    db.findOne({_id: token}, function (err, doc) {
      if (!doc.stations[0]) {
        db.update({_id: token}, {$push:{stations: room}});
        socket.join(room);
      }
    });
    this.keys[key] = room;
    var self = this;
    setTimeout(function () {
      if (key in self.keys) {
        debug('linking timeout');
        delete(self.keys[key]);
      }
    },15000);
    debug('opening '+room);
  }
  join(socket, key){
    var self = this;
    var token = this.clients[socket.id];
    var room = this.keys[key];
    if (room) {
      db.findOne({_id: token}, function (err, doc) {
        if (doc.stations.indexOf(room) == -1) {
          debug(token+' join '+room);
          db.update({_id: token}, {$push:{stations: room}});
          socket.join(room);
          socket.emit('join', true);
          delete(self.keys[key]);
        }
      });
    }else {
      socket.emit('join', false);
      debug(token+' can\'t join or already join');
    }
  }
  update(socket, data){
    var token = this.clients[socket.id];
    db.findOne({_id: token}, function (err, doc) {
      var room = doc.stations[data.station];
      debug(token+' update '+room);
      socket.broadcast.to(room).emit('update', data.changes);
    });
  }
}

module.exports = new Manager();

function genId(size) {
  var possible = "AZERTYUIOPQSDFGHJKLMWXCVBNazertyuiopqsdfghjklmwxcvbn123455679";
  var id = "";
  for(var i=0; i<size; i++){
    id += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return id;
}
