// TODO:
// Set up server
// Events:
//	On connect -- send existing objects / pre-existing data from server to newly connected users/
//	Event listeners for specific events -- incoming data (synchronise) and outcoming data (broadcast).
//	On close -- disconnect users

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.get('/', function(req, res){
	// Do nothing.
});

io.on('connection', function(socket){
	console.log('user connected');
});

server.listen(80, function(){
	console.log('Listening on port 80');
});

