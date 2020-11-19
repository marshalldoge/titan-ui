import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col, Tabs, Timeline } from "antd";
import { ClockCircleOutlined } from '@ant-design/icons';
import { getCookie, withParams} from "../../utils.js";
import * as constants from "../../constants"
import {connect} from "react-redux";
import 'firebase/firestore';
import firebase from '../../Firebase';
import "antd/dist/antd.css";
import moment from "moment";
import "./_AppointmentProfile.scss";
import {
	camelize,
	getAge,
	getJWtProperty,
	getDateFromLocalDateTime,
	getUrlParams,
	parsedFirebaseDate, isToday
} from "../../utils";
import Gallery from "react-photo-gallery";

const { TabPane } = Tabs;
const TTitle = React.lazy(() => import("../TTitle/TTitle"));
const TButton = React.lazy(() => import("../../components/TButton/TButton"));

class PatientProfile extends Component {
	componentDidMount() {

	}

	render() {
		return (
			 <React.Fragment>

			 </React.Fragment>
		)
	}
}

const mapStateToProps = state => {
	const { appUserReducer } = state;
	const { appUser } = appUserReducer;
	return {appUser};
};

export default withRouter(connect(mapStateToProps)(PatientProfile));
