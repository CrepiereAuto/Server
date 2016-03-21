var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var manager = require('./lib/manager')

http.listen(3030, function(){console.log('Listening *:3030');});

app.get('/', function(req, res){
  res.send('Hello World !');
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
