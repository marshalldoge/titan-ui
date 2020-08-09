import React, { Component } from "react";
import "../../redux/reducers/appUserReducer";
import "./_TButton.scss";
import { Icon as LegacyIcon } from '@ant-design/compatible';


class TButton extends Component {

	Icon = () => {
		if(this.props.icon){
			return <LegacyIcon type={this.props.icon} theme="filled" />;
		}
		return null;
	};
	render() {
		if(this.props.label === undefined) {
			return (
				 <div className={"buttonCtn "+(this.props.size?this.props.size:"small") + " "+(this.props.type?this.props.type:"")} onClick={this.props.onClick}>
					 <div className={"onlyIcon"+" "+(this.props.type?this.props.type:"")}>{this.Icon()}</div>
				 </div>
			);
		}
		return (
			<div className={"buttonCtn "+(this.props.size?this.props.size:"small") + " "+(this.props.type?this.props.type:"")} onClick={this.props.onClick}>
				<span className={"label "+(this.props.size?this.props.size:"small") + " "+(this.props.type?this.props.type:"")}>{this.props.label}{this.Icon()}</span>
			</div>
		);
	}
}

export default TButton;
