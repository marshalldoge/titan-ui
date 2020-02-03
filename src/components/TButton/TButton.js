import React, { Component } from "react";
import "../../redux/reducers/appUserReducer";
import "./_TButton.scss";
import { Icon } from "antd";


class TButton extends Component {

	Icon = () => {
		if(this.props.icon){
			return (
				 <Icon type={this.props.icon} theme="filled" />
			)
		}
		return null;
	};
	render() {
		return (
			<div className={"buttonCtn "+(this.props.size?this.props.size:"small") + " "+(this.props.type?this.props.type:"")} onClick={this.props.onClick}>
				<span className={"label "+(this.props.size?this.props.size:"small") + " "+(this.props.type?this.props.type:"")}>{this.props.label}{this.Icon()}</span>
			</div>
		);
	}
}

export default TButton;
