var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var manager = require('./lib/manager');
var update = require('./lib/updater');

var updating = {
  server: false,
  soft: false,
  app: false
};

http.listen(3030, function(){console.log('Listening *:3030');});

app.get('/', function(req, res){
  var page = 'Hello World ! <br>';
  if(updating.server){
    page += '<li>Server</li>';
  }
  if(updating.soft){
    page += '<li>Soft</li>';
  }
  if(updating.app){
    page += '<li>App</li>';
  }
  res.send(page);
});

app.all('/update/:key?', function(req, res, next){
  var key = req.params.key;
  if (key == 'server' || key == 'soft' || key == 'app') {
    updating[key] = true;
    res.redirect('/');
    next();
  }
}, function (req, res) {
  var key = req.params.key;
  console.log('Updating '+key);
  update(key, function () {
    updating[key] = false;
    console.log(key+' update done');
    if (key == 'server') {
      restart();
    }
  });
});

io.on('connection', function(socket){
  socket.on('disconnect', function(){
    manager.stop(socket.id);
  });

  socket.on('start', function(data) {
    manager.start(socket, data);
  });

  socket.on('open', function (data) {
    manager.open(socket, data);
  });

  socket.on('join', function (data) {
    manager.join(socket, data);
  });

  socket.on('update', function (data) {
    manager.update(socket, data);
  });

});

function restart(){
  if (updating == {server: false, soft: false, app: false}) {
    process.exit(0);
  }else {
    console.log('other update is runnig');
    setTimeout(restart, 1000);
  }
}
