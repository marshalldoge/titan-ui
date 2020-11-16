import React, { Component } from "react";
import "../../redux/reducers/appUserReducer";
import "./_TTitle.scss";
import { Icon as LegacyIcon } from '@ant-design/compatible';


class TTitle extends Component {

	render() {
		return (
			 <h1 className={"tTitle "+(this.props.size?this.props.size:"")} onClick={this.props.onClick}>{this.props.label}</h1>
		);
	}
}

export default TTitle;
