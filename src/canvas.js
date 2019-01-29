import React, { Component } from 'react';
import ColorPalette from './colorpalette';
import ActionButton from './actionbutton';
import App from './App';
import io from 'socket.io-client';

class Canvas extends React.Component {

  previousPosition = {offsetX : 0, offsetY : 0};
  lines = [];
  isPainting = false;
  socket = io('http://localhost');

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
    this.clearCanvas();
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
    // Experiment with adding this.sendServerData() at the end of this method for REAL-TIME rendering.
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
      //this.paint(this.previousPosition, offsetPositions, this.state.setLineColor);
      this.sendServerData();
    }
  }

  endPaintEvent() {
    // Fail-safe check -- checks if mouse is still pressed down and user is still painting.
    if (this.isPainting) {
      this.isPainting = false;
      //this.sendServerData(); // UNCOMMENT TO DISABLE REAL-TIME RENDERING
      this.lines = [];
    }
  }

  paint(startPosition, endPosition, lineColor) {
    const { offsetX: x, offsetY: y} = startPosition;
    const { offsetX, offsetY } = endPosition;
     
    this.ctx.beginPath();
    if(this.state.setLineColor == null){
      this.setState({setLineColor: '#FFFF00'});
    }
    this.ctx.strokeStyle = lineColor;
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();
    this.previousPosition = { offsetX, offsetY };
  }


  redrawStrokes(strokes){
    // For real time rendering (especially), this piece of code is extremely problematic. O(n^3) time.
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    console.log(strokes.length);
    for(var i = 0; i < strokes.length; i++){
      for(var j = 0; j < strokes[i].length; j++){
        for(var k = 0; k < strokes[i][j].length; k++){
          this.paint(strokes[i][j][k].start, strokes[i][j][k].end, this.state.setLineColor);
        }
      }
    }
  }

  undoStroke(){  
      this.socket.emit("undoStroke");
  }

  clearCanvas(){
      this.socket.emit("clearCanvas");
  }

  // Sending data -- only want to send the last drawn line by the user to push into the server-wide strokes array.
  sendServerData(){
    // Pack into JSON form to be read from server code.
    var dataToSend = [];
    dataToSend.push(this.lines);
    this.emitSendData(dataToSend);
  }

  componentDidMount() {
    // Setting up canvas properties. 
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 150;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 5;
    this.socket.on("connect", function(){
      console.log("connected");
    });
  }

  componentDidUpdate() {
    console.log(this.props.strokes);
    this.redrawStrokes(this.props.strokes);
  }

  emitSendData(outgoingData){
    // Draw something first and then call this wrapper method to send data to server.
    this.socket.emit("dataToServer", outgoingData);
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

export default Canvas;