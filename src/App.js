// App.js

// TO DO: 
// - Re-write canvas.js code to use state. As it is now, it's bad programming practice.
// - Use redux. Figure out why and what it does.
// - Remove or rework 'clear' functionality.

import React, { Component, Fragment } from 'react';
import './App.css';
import Canvas from './canvas';
import ColorPalette from './colorpalette';
import io from 'socket.io-client';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      strokes: []
    }
  }

  render() {
    // Rendering components into the page.

    return (
      <Fragment>
        <h3 style={{ textAlign: 'center' }}>Cooperative Paint -- an exercise in learning front-end and back-end js</h3>
        
          <div className="main">
            <Canvas strokes = {this.state.strokes}/>
          </div>
      </Fragment>
    );
  }

  componentDidMount() {
    // Opening socket when components are loaded onto the page.
    let socket = io('http://localhost');

    socket.on("clientConnect", function(incomingJSON){
      console.log("Initialising canvas with pre-existing data.");
      this.setState( {strokes: incomingJSON});
    }.bind(this));

    socket.on("incomingData", function(incomingJSON){
      // Wrapper method for canvas stuff here.
      this.setState( {strokes: incomingJSON});
    }.bind(this));

  }

}

// Setup socket connection on app.js 

export default App;