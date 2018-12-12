import React, { Component } from 'react';

class ActionButton extends React.Component {

	// Generic button component that can be used to change state of parent components / call methods when clicked.

	doAction = () => {
		this.props.callbackFromParent();
	}

	render() {
		return(
			<button onClick = {this.doAction} style={{height: 50 + 'px', width: 50 + 'px', margin: 10 + 'px'}}> {this.props.buttonName} </button>
		);
	}
}

export default ActionButton;