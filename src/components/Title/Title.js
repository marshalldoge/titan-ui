import React, { Component } from "react";
import "../../redux/reducers/appUserReducer";
import "./_Title.scss";


class Button extends Component {

	render() {
		return (
			 <h1 className={"title "+(this.props.size?this.props.size:"")}>{this.props.label}</h1>
		);
	}
}

export default Button;
