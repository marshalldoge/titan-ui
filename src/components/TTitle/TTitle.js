import React, { Component } from "react";
import "../../redux/reducers/appUserReducer";
import "./_TTitle.scss";
import { Icon as LegacyIcon } from '@ant-design/compatible';


class TTitle extends Component {

	TitleIcon = () => {
		if (this.props.icon) {
			return <LegacyIcon type={this.props.icon} onClick={this.props.onClick}/>;
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
