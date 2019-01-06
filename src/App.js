// App.js

import React, { Component, Fragment } from 'react';
import './App.css';
import Canvas from './canvas';
import ColorPalette from './colorpalette';

class App extends Component {

  render() {
    return (
      <Fragment>
        <h3 style={{ textAlign: 'center' }}>Cooperative Paint -- an exercise in learning front-end and back-end js</h3>
        <div className="main">
          <Canvas />
        </div>
      </Fragment>
    );
  }
}

export default App;