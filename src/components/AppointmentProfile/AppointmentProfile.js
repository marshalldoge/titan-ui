import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col, Tabs, Timeline } from "antd";
import {
	UserOutlined,
} from '@ant-design/icons';
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
const Conversation = React.lazy(() => import("../Conversation/Conversation"));

const firestore = firebase.firestore();

class AppointmentProfile extends Component {
	constructor(props) {
		super(props);
		this.goToPatientProfile = this.goToPatientProfile.bind(this);
		this.loadAppointmentEvents = this.loadAppointmentEvents.bind(this);
		this.loadFiles = this.loadFiles.bind(this);
	}

	state = {
		appointment: null,
		patient: null,
		conversationDay: null,
		treatments: null,
		appointmentEvents: null,
		drawerMedia: [
			{
				src: "https://mejorconsalud.com/wp-content/uploads/2014/02/moreton-hematoma-rodilla-470x313.jpg",
				width: 4,
				height: 3
			},
			{
				src: "https://hdstatic.net/gridfs/holadoctor/53602d6bb937955142fe44e2_0_7-1571840563,231.jpg",
				width: 1,
				height: 1
			},
			{
				src: "https://us.123rf.com/450wm/bankrx/bankrx1703/bankrx170300212/74107080-hematoma-de-color-marrón-en-el-fondo-de-la-rodilla-mujer.jpg?ver=6",
				width: 1,
				height: 1
			},
			{
				src: "https://img.saludsavia.com/wp-content/uploads/2019/04/Hematomas-300x200.jpg",
				width: 1,
				height: 1
			}
		]
	};

	componentDidMount() {
		this.loadAppt();
		this.loadPatient();
		this.loadAppointmentEvents();
		let me = this;
		firestore.collection("treatments")
			 .where("appointmentId", "==", parseInt(getUrlParams("appointmentId")))
			 .limit(25)
			 .onSnapshot(function(querySnapshot) {
			 	console.log('treatments received: ',querySnapshot.docs.map(t => t.data()),querySnapshot.docs.length);
			 	me.setState({treatments: querySnapshot.docs.map(t => t.data())});
			 });
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

	loadAppointmentEvents(){
		var headers = {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: getCookie("JWT")
		};
		let me = this;
		let params = {
			appointmentId: parseInt(getUrlParams('appointmentId'))
		};
		var url = withParams(constants.BACKEND_URL+"/appointmentEvent",params);
		fetch(url, {
			method: "GET",
			headers: headers
		}).then(response => response.json())
			 .then(function(response) {
				 //console.log("Result of ")
				 me.setState({
					 appointmentEvents: response.data
				 })
			 }).catch(function(error) {
			console.log(error);
		});
	}

	loadFiles(files) {
		this.setState({
			drawerMedia: files
		});
	}

	goToPatientProfile() {
		let me = this;
		me.props.history.push({
			pathname: "patient_profile",
			search: "?patientId="+getUrlParams('patientId')
		})
	};

	FieldValue = (prefix, value, suffix) => {
		if(suffix === undefined) suffix="";
		return (
			 <Row>
				 <Col span={8} className={"field-name"}>
					 {prefix}
				 </Col>
				 <Col span={16}>
					 {value+" "+suffix}
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
		if(this.state.appointmentEvents === null) return null;
		let appointmentEvents = this.state.appointmentEvents.map((event,idx) => {
			return (
				 <Timeline.Item key={idx}>
					 <Row>
						 <Col span={24}>
							 {event.name}
						 </Col>
					 </Row>
					 <Row>
						 <Col span={24}>
							 {event.description}
						 </Col>
					 </Row>
					 <Row>
						 <Col span={24}>
							 {moment(event.creationTimeStamp).format("YYYY-MM-DD HH:mm")}
						 </Col>
					 </Row>
				 </Timeline.Item>
			)
		});
		return (
			 <Timeline mode="alternate" className={"timeline"}>
				 {appointmentEvents}
			 </Timeline>
		)
	};
	/*
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
	 */

	TreatmentCard = (treatment,idx) => {
		let secondsMap = {

		};
		return (
			 <Row key={idx} className={"treatment-card-ctn"}>
				 <Col span={24}>
					 <Row>
						 <Col span={24}>
							 <TTitle label={"Descripción"} size={"small"}/>
						 </Col>
					 </Row>
					 <Row justify={"center"}>
						 <Col span={24}>
							 {treatment.description}
						 </Col>
					 </Row>
					 <Row justify={"space-around"}>
						 <Col span={8}>
							 {this.FieldValue("Inicio: ",parsedFirebaseDate(treatment.startTimestamp))}
						 </Col>
						 <Col span={8}>
							 {this.FieldValue("Cant: ",treatment.recurrence," veces")}
						 </Col>
						 <Col span={8}>
							 {this.FieldValue("Cada: ",treatment.interval/3600," Horas")}
						 </Col>
					 </Row>
				 </Col>
			 </Row>
		)
	};

	Treatments = () => {
		if(this.state.treatments === null) return null;
		let treatments = this.state.treatments.map((treatment, idx) => this.TreatmentCard(treatment,idx));
		return treatments;
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
								  icon={<UserOutlined />}
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
								  doctorAppUserId={this.props.appUser.id}
								  patientAppUserId={this.state.patient.appUser.id}
								  loadAppointmentEvents={this.loadAppointmentEvents}
								  loadFiles={this.loadFiles}
							 />
							 }
						 </Col>
						 <Col span={12} offset={1}>
							 <Tabs defaultActiveKey="1" onChange={this.onChangeTab}>
								 <TabPane tab="Resumen" key="1">
									 {this.state.appointment && this.AppointmentTimeline()}
								 </TabPane>
								 <TabPane tab="Media" key="2">
									 <Row className={"gallery"}>
										 <Gallery photos={this.state.drawerMedia} renderImage={this.imageRenderer}/>
									 </Row>
								 </TabPane>
								 <TabPane tab="Tratamientos" key="3">
									 {this.Treatments()}
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
