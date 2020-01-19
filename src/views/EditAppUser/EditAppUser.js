import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Card } from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import "../../redux/reducers/appUserReducer";
import "../../stylesheets/views/shift/_shift.scss";
import "./_EditAppUser.scss";


class EditAppUser extends Component {
	//TODO: Make a form to edit appuser basic information
	render() {
		return (
			 <div className={"buttonCtn "+this.props.size} onClick={this.props.onClick}>
				 <span className={"label "+this.props.size}>{"LoL"}</span>
			 </div>
		);
	}
}

export default EditAppUser;
