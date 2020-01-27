import React, { Component} from "react";
import { withRouter} from "react-router-dom";
import {Button, Form, Input, Select} from "antd";
import { getCookie} from "../../utils.js";
import "antd/dist/antd.css";
import "./_ItemManualManager.scss";
import {withParams} from "../../utils";
import {connect} from "react-redux";
import * as constants from "../../constants";
import {BACKEND_URL} from "../../constants";


class ItemManualManager extends Component {


	render() {
		console.log("Props: ",this.props);
		return (
			 <div>

			 </div>
		);
	}
}

const mapStateToProps = state => {
	const { appUserReducer } = state;
	const { idCompany } = appUserReducer;
	console.log("idCompany for tableUser: ",idCompany);
	return {idCompany};
};
export default withRouter(connect(mapStateToProps)(ItemManualManager));

