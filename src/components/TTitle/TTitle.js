import React, { Component } from "react";
import "../../redux/reducers/appUserReducer";
import "./_TTitle.scss";
import {Icon} from "antd";


class TTitle extends Component {

	TitleIcon = () => {
		if (this.props.icon) {
			return <Icon type={this.props.icon} onClick={this.props.onClick}/>
		}
		return null;
	};

	render() {
		return (
			 <h1 className={"tTitle "+(this.props.size?this.props.size:"")}>{this.props.label}{this.TitleIcon()}</h1>
		);
	}
}

export default TTitle;
