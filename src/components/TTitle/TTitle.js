import React, { Component } from "react";
import "../../redux/reducers/appUserReducer";
import "./_TTitle.scss";

class TTitle extends Component {

	Icon = () => {
		if(this.props.icon != null) return this.props.icon;
		return null;
	};
	render() {
		return (
			 <h1 className={"tTitle "+(this.props.size?this.props.size:"")} onClick={this.props.onClick}>
				 {this.props.label}
				 <span className={"t-title-icon"}>{this.Icon()}</span>
			 </h1>
		);
	}
}

export default TTitle;
