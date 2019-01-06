import React, { Component } from 'react';
import ColorPalette from './colorpalette';
import ActionButton from './actionbutton';

// Based off of Pusher's tutorial

class Canvas extends React.Component {
  
  // Class properties
  // 'strokes' is used for movement of mouse while drawing while 'lines' is strictly used for drawing methods.
  isPainting = false;
  previousPosition = {offsetX : 0, offsetY : 0};
  lines = [];
  strokes = [];

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

  clearCanvasCallback = () => {
    this.hardClearCanvas();
  }

  undoCanvasCallback = () => {
    this.undoStroke();
  }

  onMouseDown({nativeEvent}) {
    const {offsetX, offsetY} = nativeEvent;
    this.isPainting = true;
    this.previousPosition = {offsetX, offsetY};
  }

  onMouseMove({nativeEvent}) {
    // Records mouse movement and stores it as an object with properties denoting the start and end position of incremental mouse movements.
    // The lines array stores all the mouse movements and is not the whole line itself. Stroke array is used to store the whole line drawn by user.
    if (this.isPainting) {
      const {offsetX, offsetY} = nativeEvent;
      const offsetPositions = {offsetX, offsetY};
      // Setting the start and stop position.
      const positionData = {
        start: { ...this.previousPosition},
        end: { ...offsetPositions}, 
      };
      this.lines = this.lines.concat(positionData);
      this.paint(this.previousPosition, offsetPositions, this.state.setLineColor);
    }
  }

  // Experiment sending data after this.paint(...), see how that works out?
  // The trouble with sending data after ending paint event tis that only strokes will be seen and not real time user movement.
  // Undo, clear and draw will all need to send data to each other... How does it deal with rt drawing and rt clear / undo?

  endPaintEvent() {
    // Fail-safe check -- checks if mouse is still pressed down and user is still painting.
    if (this.isPainting) {
      this.isPainting = false;

      // Each user stroke is contained in an array for editing purposes (undo, clear, etc.).
      this.strokes.push(this.lines);
      this.lines = [];
    }
  }

  paint(startPosition, endPosition, lineColor) {
    const { offsetX: x, offsetY: y} = startPosition;
    const { offsetX, offsetY } = endPosition;
     
    this.ctx.beginPath();
    if(this.state.setLineColor == null){
      this.state.setLineColor = '#FFFF00';
    }
    this.ctx.strokeStyle = lineColor;
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();
    this.previousPosition = { offsetX, offsetY };
  }

  undoStroke(){  
    this.strokes.pop();

    this.softClearCanvas();

    for(var i = 0; i < this.strokes.length; i++){
      for(var j = 0; j < this.strokes[i].length; j++){
        this.paint(this.strokes[i][j].start, this.strokes[i][j].end, this.state.lineColor);
      }
    }
  }

  softClearCanvas(){
    // Used for undo.
    // Clears canvas to be ready for undo-ing last stroke. 
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.lines = [];
  }

  hardClearCanvas(){
    // Used for clearing canvas.
    // Clears canvas and all associated strokes inputted by users.
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.lines = [];
    this.strokes = [];
  }

  componentDidMount() {
    // Setting up canvas properties. 
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 150;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 5;
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
        <ActionButton callbackFromParent = {this.clearCanvasCallback} buttonName='Clear'/>
        <ActionButton callbackFromParent = {this.undoCanvasCallback} buttonName ='Undo'/>
      </div>

      </div>

    );
  }
}

// How to get previous state for undo bug? Bug - Undo re-draws everything with currently selected color instead of previously selected color.
// Solution: Implement a stack-like state?

// Extend functionality to add:
// Server-side & cooperative drawing

export default Canvas;