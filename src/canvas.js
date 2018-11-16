import React, { Component } from 'react';
import ColorPalette from './colorpalette';

// Based off of Pusher's tutorial

class Canvas extends React.Component {
  
  // Class properties
  isPainting = false;
  previousPosition = {offsetX : 0, offsetY : 0};
  lines = [];

  constructor(props) {
    super(props);
    // Binding events to this class object to listen for handlers.
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.endPaintEvent = this.endPaintEvent.bind(this);
    this.state = {
      setLineColor: null,
    };
  }

  colorCallback = (lineColor) => {
    this.setState({ setLineColor: lineColor });
  }

  onMouseDown({nativeEvent}) {
    const {offsetX, offsetY} = nativeEvent;
    this.isPainting = true;
    this.previousPosition = {offsetX, offsetY};
  }

  onMouseMove({nativeEvent}) {
    if (this.isPainting) {
      const {offsetX, offsetY} = nativeEvent;
      const offsetPositions = {offsetX, offsetY};
      // Setting the start and stop position.
      const positionData = {
        start: { ...this.previousPosition},
        end: { ...offsetPositions}, // Figure out if this is necessary, instead of just putting nativeEvent or offsetPositions.
      };
      // Adding line position to an array.
      this.lines = this.lines.concat(positionData);
      this.paint(this.previousPosition, offsetPositions);
    }
  }

  endPaintEvent() {
    // Fail-safe check.
    if (this.isPainting) {
      this.isPainting = false;
    }
  }

  paint(startPosition, endPosition) {
    const { offsetX, offsetY } = endPosition;
    const { offsetX: x, offsetY: y} = startPosition;
     
    this.ctx.beginPath();
    if(this.state.setLineColor == null){
      this.state.setLineColor = '#FFFF00';
    }
    this.ctx.strokeStyle = this.state.setLineColor;
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();
    this.previousPosition = { offsetX, offsetY };

  }

  componentDidMount() {
    // Setting up canvas element properties. 
    // Canvas is instantiated through a tag in the render function.
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 150;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 5;

    var canvasElement = document.createElement("canvasDOM");
    document.body.appendChild(canvasElement);
    // Apparently Canvas isn't added into DOM tree?????????
  }

  clearCanvas(){
    this.canvasCtx = document.getElementById(this.canvas);
    var all = document.getElementsByTagName("*");
    //alert(this.canvasCtx);

    for(var i = 0, max = all.length; i < max; i++){
      alert(all[i]);
    }

  }

  render () {

    return (

      <div>

      <div className = "main">
      <canvas ref = {(ref) => (this.canvas = ref)}
        style = {{background: 'black'}}
        onMouseDown = {this.onMouseDown}
        onMouseLeave = {this.endPaintEvent}
        onMouseUp = {this.endPaintEvent}
        onMouseMove = {this.onMouseMove}
      />
      </div>
      
      <div id = "bottom">
        <ColorPalette callbackFromParent = {this.colorCallback} lineColor='#FF0000' circleX={25} circleY={30}/>
        <ColorPalette callbackFromParent = {this.colorCallback} lineColor='#00FF00' circleX={25} circleY={30}/>
        <ColorPalette callbackFromParent = {this.colorCallback} lineColor='#0000FF' circleX={25} circleY={30}/>
        <ColorPalette callbackFromParent = {this.colorCallback} lineColor='#FFFF00' circleX={25} circleY={30}/>
      
        <button onClick = {this.clearCanvas()}> This button </button>

      </div>

      </div>

    );
  }
}

// Extend functionality to add:
// Color palette
// Clear button
// Undo button
// Server-side & cooperative drawing

export default Canvas;