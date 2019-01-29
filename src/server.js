// TODO:
// Set up server
// Events:
//	On connect -- send existing objects / pre-existing data from server to newly connected users/
//	Event listeners for specific events -- incoming data (synchronise) and outcoming data (broadcast).
//	On close -- disconnect users

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var strokes = [];

app.get('/', function(req, res){
	// When user lands on main page, serve user index.html page.
	var htmlPath = __dirname;
	htmlPath = htmlPath.replace("src", "public/index.html");
	console.log(htmlPath);
});


io.on('connection', function(socket){
	console.log("User has connected"); // debug
	
	// Initialise user's canvas with existing data on server side.
	if(strokes.length > 0){
		var outgoingData = strokes;
		socket.emit("clientConnect", outgoingData);
	}

	// Listens for any data sent to server from client and synchronises data by broadcasting it.
	socket.on("dataToServer", function(data){
		// This also works here.
		strokes.push(data);
		var outgoingData = strokes;
		socket.broadcast.emit("incomingData", outgoingData);
	});

	socket.on("undoStroke", function() {
		try{
			strokes.pop();
			var outgoingData = strokes;
			socket.broadcast.emit("incomingData", outgoingData);
			console.log('undo');
		}
		catch(e){
			// Do nothing.
		}
	});

	socket.on("clearCanvas", function() {
		// Maybe add a warning for all users.
		strokes = [];
		var outgoingData = strokes;
		socket.broadcast.emit("incomingData", outgoingData); 
		console.log('clear');
	})

	socket.on("disconnect", function() {
		console.log("User has disconnected.");
	});

});


server.listen(80, function(){
	console.log('Listening on port 80');
});

