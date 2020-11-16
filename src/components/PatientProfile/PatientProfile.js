import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {Row, Col, Input, Button, Select, Drawer, DatePicker} from "antd";
import { SendOutlined, PaperClipOutlined, ThunderboltOutlined } from '@ant-design/icons';
import * as constants from "../../constants"
import {connect} from "react-redux";
import moment from "moment";
import "antd/dist/antd.css";
import "./_PatientProfile.scss";
import loadingChat from'../../assets/gif/loadingChat.gif';
import {getJWtProperty, getTime, getUrlParams, parsedFirebaseTime, parsedFirebaseDate, getAge, isToday} from "../../utils";

class PatientProfile extends Component {



	state = {
		appointment: null,
		patient: null,
		conversationDates: null,
		messages: null,
		query: null,
		messageText: "",
		actionSelected: "",
		isActionDrawerOpen: false
	};

	componentDidMount() {
	}

	render() {
		return (
			 <div></div>
		)
	}
}

const mapStateToProps = state => {
	const { appUserReducer } = state;
	const { idCompany } = appUserReducer;
	return {idCompany};
};

export default withRouter(connect(mapStateToProps)(PatientProfile));
