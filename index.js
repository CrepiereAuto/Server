var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var manager = require('./lib/manager')
var update = require('./lib/updater')

http.listen(3030, function(){console.log('Listening *:3030');});

app.get('/', function(req, res){
  res.send('Hello World !');
});

app.get('/update/soft', function(req, res){
  res.send('ok');
  update.soft(function () {
    console.log('done');
  })
});

app.get('/update/app', function(req, res){
  res.send('ok');
});

app.get('/update/server', function(req, res){
  res.send('ok');
  update.server(function () {
    console.log('done');
    proccess.exit(0)
  })
});

io.on('connection', function(socket){
  socket.on('disconnect', function(){
    manager.stop(socket.id)
  })

  socket.on('start', function(data) {
    manager.start(socket, data)
  })

  socket.on('open', function (data) {
    manager.open(socket, data)
  })

  socket.on('join', function (data) {
    manager.join(socket, data)
  })

})
