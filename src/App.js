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
    const socket = io('http://localhost:3000');
  }

}

// Setup socket connection on app.js 

export default App;