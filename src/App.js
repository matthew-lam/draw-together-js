// App.js

import React, { Component, Fragment } from 'react';
import './App.css';
import Canvas from './canvas';
import ColorPalette from './colorpalette';
import io from 'socket.io-client';

class App extends Component {

  render() {
    // Rendering components into the page.
    return (
      <Fragment>
        <h3 style={{ textAlign: 'center' }}>Cooperative Paint -- an exercise in learning front-end and back-end js</h3>
        
          <div className="main">
            <Canvas/>
          </div>
      </Fragment>
    );
  }

  componentDidMount() {
    // Opening socket when components are loaded onto the page.
    const  socket = io('http://localhost');

    socket.on("connect", function(){
      console.log('emit working');

      socket.on("clientConnect", function(incomingJSON){
        console.log("Initialising canvas with pre-existing data.");
        //Canvas.serverDrawData(incomingJSON.data); // This doesnt work due to the scope of the canvas and it's properties when using "this".
      });

      socket.on("incomingData", function(incomingJSON){
        // Wrapper method for canvas stuff here.
        //Canvas.serverDrawData(incomingJSON.data); // This doesnt work due to the scope of the canvas and it's properties when using "this".
      });

    });
  }

  static emitSendData(outgoingData){
    // Draw something first and then call this wrapper method to send data to server.
    const socket = io('http://localhost');
    socket.on("connect", function(){
      socket.emit("dataToServer", outgoingData);
      console.log("Successfully sent data.");
    });
  }

}

// Setup socket connection on app.js 

export default App;