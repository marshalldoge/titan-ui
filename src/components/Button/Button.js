import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Card } from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import "../../redux/reducers/appUserReducer";
import "../../stylesheets/views/shift/_shift.scss";
import "./_Button.scss";


class Button extends Component {

	render() {
		return (
			<div className={"buttonCtn "+this.props.size} onClick={this.props.onClick}>
				<span className={"label "+this.props.size}>{this.props.label}</span>
			</div>
		);
	}
}

export default Button;
