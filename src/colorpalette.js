import React, { Component } from 'react';

class ColorPalette extends React.Component {

	// This class is used to instantiate buttons to set ink color for the user's cursor.

	setColor = () => {
		// Callback function to set state of lineColor in canvas component.
		this.props.callbackFromParent(this.lineColor);
	}

	componentDidMount() {
		this.lineColor = this.props.lineColor;
	}

	render() {
		// Renders the button and sets an event.
		// When button is clicked, sets ink color of user's cursor by changing property of lineColor in canvas.js

		return(
			<svg>
				<circle onClick={() => this.setColor()} cx = {this.props.circleX} cy = {this.props.circleY} r = {10} fill = {this.props.lineColor} />
			</svg>
		);
	}

}

export default ColorPalette;