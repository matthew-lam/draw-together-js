// Based off of Medium.com -- Node.js & WebSocket tutorial.

var webSocketServer = require('websocket').server;
var http = require('http');

// Express not needed since no routing is necessary.
// Only need to send strokes from server to each client to be able to re-draw everything currently on canvas.

const serverPort = 3000;
var strokes = [];
var clients = []; // Just to keep track of currently connected users.


// Setting up HTTP server
var server = http.createServer(function(request, response) {
	// Server doesn't need to implement anything right now.
});

server.listen(serverPort, function() {
	console.log((new Date()) + " - Server is listening on port " + serverPort);
});


// Setting up websocket server
var wsServer = new webSocketServer({
	// Websocket server built on top of HTTP server
	httpServer : server,
	autoAcceptConnections : false
});


// Callback function that is called everytime someone connects to web server.
wsServer.on('request', function(request) {
	console.log((new Date()) + " Connection from origin : " + request.origin);

	// Accepting connection provided that client connects from website -- for security purposes.
	var connection = request.accept(null, request.origin);
	console.log(new Date() + " connection accepted.");

	// Ensures that current state of canvas at a given time is sent to newly connected users.
	if (strokes.length > 0){
		connection.sendUTF(JSON.stringify({ type: 'strokes', data: strokes}));
	}

	// User draws a line
	connection.on('message', function(message) {
		// Unpacking stroke data from sent message. The message is packed similarly to as it is sent -- as a custom typed JSON.
		try{

		} catch (e) {
			console.log('JSON data invalid: ', )
		}
	});


	// So, server.js should hold the original 'strokes' list
		// server.js starts off with a blank list for 'strokes'.
		// Don't actually need to 'draw' it on the server.
			// Only need to send and synchronise contents inside 'strokes' between all clients.
			// So, after endPaint() in canvas.js is called, push data to server.
			// Then tell server to send 'strokes' array to all clients in server.
			// Finally, overwrite all 'strokes' list for clients and re-draw canvas. Clients should listen for that.
			// WHEN LOTS OF LINES ARE PRESENT, THERE WILL BE LAG. Optimisation improvements later.


});