var blobs = [];

function Blob(x, y, r, id) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.id = id;
  //this.name = name;
}


var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log('Server online ...');

var socket = require('socket.io');

var io = socket(server);

setInterval(heartbeat, 50);

function heartbeat() {
  io.sockets.emit('heartbeat', blobs);
  //setTimeout(heartbeat, 1000);
}

io.sockets.on('connection',

function(socket) {

  console.log('New Connection : ' + socket.id);

  socket.on('start',

  function(data) {

    console.log(socket.id + ' : ' + data.x + ' , ' + data.y + ' ' + data.r);

//var thisName = input.value();
    var blob = new Blob(data.x, data.y, data.r, socket.id);
    blobs.push(blob);
  }
);

  socket.on('update',

  function(data) {

    console.log(socket.id + ' : ' + data.x + ' , ' + data.y + ' ' + data.r);

    var blob;
    for (var i = 0; i < blobs.length; i++) {
      if (socket.id === blobs[i].id) {
        blob = blobs[i];
      }
    }

    blob.x = data.x;
    blob.y = data.y;
    blob.r = data.r;
    }
  );
 }
);
