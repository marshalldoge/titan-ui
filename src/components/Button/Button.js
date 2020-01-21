import React, { Component } from "react";
import "../../redux/reducers/appUserReducer";
import "./_Button.scss";


class Button extends Component {

	render() {
		return (
			<div className={"buttonCtn "+this.props.size+" "+(this.props.inverse?"inverse":"")} onClick={this.props.onClick}>
				<span className={"label "+this.props.size+" "+(this.props.inverse?"inverse":"")}>{this.props.label}</span>
			</div>
		);
	}
}

export default Button;
