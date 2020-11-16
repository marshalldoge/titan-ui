import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col, Tabs, Timeline } from "antd";
import { ClockCircleOutlined } from '@ant-design/icons';
import { getCookie, withParams} from "../../utils.js";
import * as constants from "../../constants"
import {connect} from "react-redux";
import "antd/dist/antd.css";
import "./_AppointmentProfile.scss";
import {camelize, getAge, getJWtProperty, getDateFromLocalDateTime, getUrlParams} from "../../utils";

const { TabPane } = Tabs;
const TTitle = React.lazy(() => import("../TTitle/TTitle"));
const Conversation = React.lazy(() => import("../Conversation/Conversation"));

class AppointmentProfile extends Component {
	constructor(props) {
		super(props);
		this.goToPatientProfile = this.goToPatientProfile.bind(this);
	}

	state = {
		appointment: null,
		patient: null,
		conversationDay: null
	};

	componentDidMount() {
		this.loadAppt();
		this.loadPatient();
	}

	loadAppt(){
		var headers = {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: getCookie("JWT")
		};
		let me = this;
		var url = constants.BACKEND_URL+"/appointment/"+getUrlParams('appointmentId');
		fetch(url, {
			method: "GET",
			headers: headers
		}).then(response => response.json())
			 .then(function(response) {
				 //console.log("Result of ")
				 let day = 0;
				 me.setState({
					 appointment: response.data
				 })
			 }).catch(function(error) {
			console.log(error);
		});
	}

	loadPatient(){
		var headers = {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: getCookie("JWT")
		};
		let me = this;
		var url = constants.BACKEND_URL+"/patient/"+getUrlParams('patientId');
		fetch(url, {
			method: "GET",
			headers: headers
		}).then(response => response.json())
			 .then(function(response) {
				 //console.log("Result of ")
				 me.setState(prevState => {
				 	let patient = response.data;
				 	patient.appUser.firstName = camelize(patient.appUser.firstName);
				 	patient.appUser.lastName = camelize(patient.appUser.lastName);
				 	return prevState;
				 });
				 me.setState({
					 patient: response.data
				 })
			 }).catch(function(error) {
			console.log(error);
		});
	}

	goToPatientProfile() {
		let me = this;
		me.props.history.push({
			pathname: "patient_profile",
			search: "?patientId="+getUrlParams('patientId')
		})
	};

	FieldValue = (name, value) => {
		return (
			 <Row>
				 <Col span={8} className={"field-name"}>
					 {name}
				 </Col>
				 <Col span={16}>
					 {value}
				 </Col>
			 </Row>
		);
	};

	PatientData = () => {
		if(this.state.patient === null) return null;
		return (
			 <Row className={"patient-data-ctn"}>
				 <Col span={24}>
					 <Row>
						 <Col span={8}>
							 {this.FieldValue("Nombre: ",
								  this.state.patient.appUser.firstName +
								  " " +
								  this.state.patient.appUser.lastName
							 )}
						 </Col>
						 <Col span={8}>
							 {this.FieldValue("Género: ",this.state.patient.appUser.genre)}
						 </Col>
						 <Col span={8}>
							 {this.FieldValue("Edad: ",getAge(this.state.patient.appUser.birthDay))}
						 </Col>
					 </Row>
					 <Row>
						 <Col span={8}>
							 {this.FieldValue("Altura: ",this.state.patient.appUser.height)}
						 </Col>
						 <Col span={8}>
							 {this.FieldValue("Peso: ",this.state.patient.appUser.weight)}
						 </Col>
						 <Col span={8}>
							 {this.FieldValue("Celular: ",this.state.patient.appUser.phone)}
						 </Col>
					 </Row>
				 </Col>
			 </Row>
		)
	};

	onChangeTab = (key) => {
		console.log(key);
	};

	AppointmentTimeline = () => {
		return (
			 <Timeline mode="alternate">
				 <Timeline.Item>{"Consulta creada el "+getDateFromLocalDateTime(this.state.appointment.creationTimeStamp) }</Timeline.Item>
				 <Timeline.Item color="green">Solve initial network problems 2015-09-01</Timeline.Item>
				 <Timeline.Item dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}>
					 Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
					 laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
					 beatae vitae dicta sunt explicabo.
				 </Timeline.Item>
				 <Timeline.Item color="red">Network problems being solved 2015-09-01</Timeline.Item>
				 <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
				 <Timeline.Item dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}>
					 Technical testing 2015-09-01
				 </Timeline.Item>
			 </Timeline>
		)
	};

	render() {
		return (
			 <Row className={"appointment-profile-ctn"}>
				 <Col span={24} className={"appointment-profile-sub-ctn"}>
					 <Row className={"appointment-title-ctn"}>
						 <Col>
							 <TTitle
								  label={"Consulta - "+(this.state.patient && (this.state.patient.appUser.firstName +
									   " " +
									   this.state.patient.appUser.lastName))}
								  size={"big"}
								  onClick={this.goToPatientProfile}
							 />
						 </Col>
					 </Row>
					 <Row className={"profile-body-ctn"}>
						 <Col span={11} className={"profile-body-sub-ctn"}>
							 <Row className={"messages-title-ctn"}>
								 <Col>
									 <TTitle
										  label={"Mensajes"}
										  size={"medium"}
										  onClick={() => this.props.onEditClick(this.props.person)}
									 />
								 </Col>
							 </Row>
							 {this.state.appointment && this.state.patient &&
							 <Conversation
								  appointmentId={this.state.appointment.id}
								  appUser={
									  {
										  [this.props.appUser.id]: this.props.appUser,
										  [this.state.patient.appUser.id]: this.state.patient.appUser
									  }
								  }
								  doctorId={this.props.appUser.id}
							 />
							 }
						 </Col>
						 <Col span={10} offset={1}>
							 <Tabs defaultActiveKey="1" onChange={this.onChangeTab}>
								 <TabPane tab="Resumen" key="1">
									 {this.state.appointment && this.AppointmentTimeline()}
								 </TabPane>
								 <TabPane tab="Media" key="2">
									 Content of Tab Pane 2
								 </TabPane>
								 <TabPane tab="Tratamientos" key="3">
									 Content of Tab Pane 3
								 </TabPane>
							 </Tabs>
						 </Col>
					 </Row>
				 </Col>
			 </Row>
		);
	}
}

const mapStateToProps = state => {
	const { appUserReducer } = state;
	const { appUser } = appUserReducer;
	return {appUser};
};

export default withRouter(connect(mapStateToProps)(AppointmentProfile));
