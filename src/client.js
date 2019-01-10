var canvasWrapper = require('./canvas');

var connection = new WebSocket('ws://127.0.0.1:3000');

// Uses callbacks to communicate between client's front end components and server. (Middleware)
// Wrapper methods to allow canvas/client's front end to update.

var mwStrokes = [];

connection.addEventListener('open', function(e) {
	// Verifying to user that they have connected to the server.
	console.log('Connected to server.');
})

connection.addEventListener('error', function (error) {
	console.log('Failed to connect to server.');
})

// Handling messages from the server.
connection.addEventListener('message', function (message) {
	// Unpack and parse message data.

	var jsonMessage;
	try{
		jsonMessage = JSON.parse(message.data);
	} catch (e) {
		console.log('JSON data invalid: ', message.data);
		return;
	}

	// Determine what type and purpose of message is and act accordingly.
	if(jsonMessage.type == 'initStrokes'){
		// Initialise and synchronise canvas for newly connected clients.
		mwStrokes = jsonMessage.data;
		// Call wrapper method from canvas.js to populate 'strokes' array for newly connected users first.
			// Then draw it on canvas via the wrapper method.
		canvasWrapper.serverDrawData(mwStrokes);
		console.log('Message sent by SERVER1.');

	}
	else if(jsonMessage.type == 'strokes'){
		// Another user has drawn a line.
		// TOUGHIE : client.js receives data, how to draw on canvas?
		// Call wrapper method -- same method as above.
		mwStrokes.push(jsonMessage.data);
		canvasWrapper.serverDrawData(mwStrokes);
		console.log('Message sent by SERVER2.');
	}
	else if(jsonMessage.type == 'outgoingStrokes'){
		// A user is sending message to the server.
		connection.send(jsonMessage);
		console.log('Message sent by CLIENT.');
	}

});