// var app = require('express')();
// var bodyParser = require('body-parser');
// var manager = require('./lib/manager');
// var update = require('./lib/updater');
var IOT = require('socket.io-iot-server').default;

var updating = {
  server: false,
  soft: false,
  app: false
};

var iot = new IOT(3030);

iot.start();

iot.on('connection', (client) => {
  console.log('Connect: '+client.id);
});

// setTimeout(function () {
//   iot.pins.splice(0, 1)
// }, 10000);
// app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//
// app.get('/', function(req, res){
//   var page = 'Hello World ! <br>';
//   if(updating.server){
//     page += '<li>Server</li>';
//   }
//   if(updating.soft){
//     page += '<li>Soft</li>';
//   }
//   if(updating.app){
//     page += '<li>App</li>';
//   }
//   res.send(page);
// });
//
// app.all('/update/:key?', function(req, res, next){
//   var key = req.params.key;
//   if (key == 'server' || key == 'soft' || key == 'app') {
//     updating[key] = true;
//     res.redirect('/');
//     next();
//   }
// }, function (req, res) {
//   var key = req.params.key;
//   console.log('Updating '+key);
//   update(key, function () {
//     updating[key] = false;
//     console.log(key+' update done');
//     if (key == 'server') {
//       restart();
//     }
//   });
// });
//
// var rooms = {}
//
// app.post('/room/:pin', function (req, res) {
//
//   var pin = req.params.pin
//   res.header("Access-Control-Allow-Origin", "*");
//
//   if (rooms[pin]) {
//     res.send('error');
//   } else {
//     rooms[pin] = req.body.data
//     setTimeout(function () {
//       if (rooms[pin]) {
//         delete(rooms[pin])
//         console.log('Timeout');
//       }
//     }, 30000);
//     res.send('done');
//   }
//   console.log(rooms);
//   console.log('Room '+pin+' is open');
// });
//
// app.get('/room/:pin', function (req, res) {
//
//   var pin = req.params.pin
//   res.header("Access-Control-Allow-Origin", "*");
//
//   if (rooms[pin]) {
//     res.send(rooms[pin]);
//     delete(rooms[pin])
//   } else {
//     res.send('error');
//   }
//   console.log('Connect room '+pin);
// });
//
//
// app.listen(3000, function () {
//   console.log('Listening on port 3000!');
// });
//
// function restart(){
//   if (updating == {server: false, soft: false, app: false}) {
//     process.exit(0);
//   }else {
//     console.log('other update is runnig');
//     setTimeout(restart, 1000);
//   }
// }
