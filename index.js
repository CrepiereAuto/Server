var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var manager = require('./lib/manager')
var update = require('./lib/updater')

http.listen(3030, function(){console.log('Listening *:3030');});

app.get('/', function(req, res){
  res.send('Hello World !');
});

app.all('/update/:key?', function(req, res, next){
  var key = req.params.key;
  if (key == 'server' || key == 'soft' || key == 'app') {
    res.send('Update '+key);
    next()
  }else {
    res.send('Update nothing');
  }
}, function (req, res) {
  var key = req.params.key;
  console.log('Updating '+key);
  update(key, function () {
    console.log('Done');
    if (key == 'server') {
      process.exit(0)
    }
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
