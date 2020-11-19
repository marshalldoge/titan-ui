import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {Row, Col, Input, Button, Select, Drawer, DatePicker, Tabs, List, Collapse} from "antd";
import {SendOutlined, PaperClipOutlined, ThunderboltOutlined, UserOutlined} from '@ant-design/icons';
import * as constants from "../../constants"
import {connect} from "react-redux";
import moment from "moment";
import "antd/dist/antd.css";
import "./_PatientProfile.scss";
import firebase from '../../Firebase';
import loadingChat from'../../assets/gif/loadingChat.gif';
import {
	getJWtProperty,
	getTime,
	getUrlParams,
	parsedFirebaseTime,
	parsedFirebaseDate,
	getAge,
	isToday,
	getCookie, camelize, withParams, getDateFromLocalDateTime
} from "../../utils";
import Gallery from "react-photo-gallery";

const { TabPane } = Tabs;
const { Panel } = Collapse;
const TTitle = React.lazy(() => import("../TTitle/TTitle"));
const TButton = React.lazy(() => import("../TButton/TButton"));

const firestore = firebase.firestore();

class PatientProfile extends Component {

	state = {
		appointment: null,
		patient: null,
		conversationDates: null,
		messages: null,
		query: null,
		messageText: "",
		actionSelected: "",
		isActionDrawerOpen: false,
		appointmentPageData: [],
		currentPage: 0,
		pageSize: 10,
		treatments: null
	};

	componentDidMount() {
		this.loadPatient();
		this.getPage(0,"");
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
					 prevState.patient = patient;
					 return prevState;
				 });
				 console.log('searching treatmets for patient: ',response.data.appUser.id);
				 firestore.collection("treatments")
					  .where("patientAppUserId", "==", response.data.appUser.id)
					  .limit(25)
					  .onSnapshot(function(querySnapshot) {
						  console.log('treatments received: ',querySnapshot.docs.map(t => t.data()),querySnapshot.docs.length);
						  me.setState({treatments: querySnapshot.docs.map(t => t.data())});
					  });
			 }).catch(function(error) {
			console.log(error);
		});
	}

	getPage = (page,searchValue) => {
		//console.log("sale tale props: ",this.props);
		//console.log("Loading page: ",page);
		var headers = {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: getCookie("JWT")
		};
		let me = this;
		let params = {
			page: page,
			pageSize: this.state.pageSize,
			patientId: getUrlParams('patientId'), //Status 0 means that open appointments
			searchValue: searchValue
		};
		let url = withParams(constants.BACKEND_URL + "/appointment/patient/page", params);
		fetch(url, {
			method: "GET",
			headers: headers
		}).then(response => response.json())
			 .then(function (response) {
				 //console.log("me in getpage fetch is ",me);
				 if(response.data === null) response.data = {
					 content: []
				 };
				 if(response.success){
					 //console.log("Page data received: ",response);
					 me.setState ((prevState) =>{
						 prevState.appointmentPageData[page] = response.data.content;
						 return prevState;
					 });
				 }
			 }).catch(function (error) {
			console.log(error);
		});
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
		return (
			 <React.Fragment>
				 <Row className={"patient-data-row-ctn"}>
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
						 {this.FieldValue("Edad: ",getAge(this.state.patient.appUser.birthDate))}
					 </Col>
				 </Row>
				 <Row className={"patient-data-row-ctn"}>
					 <Col span={8}>
						 {this.FieldValue("Altura: ",this.state.patient.height)}
					 </Col>
					 <Col span={8}>
						 {this.FieldValue("Peso: ",this.state.patient.weight)}
					 </Col>
					 <Col span={8}>
						 {this.FieldValue("Celular: ",this.state.patient.appUser.phone)}
					 </Col>
				 </Row>
			 </React.Fragment>
		);
	};

	MedicalData = () => {
		if(this.state.patient === null) return null;
		const allergies = this.state.patient.allergies.map(allergy => {
			return allergy.name;
		});
		const medications = this.state.patient.medications.map(medication => {
			return medication.name;
		});
		const substances = this.state.patient.substances.map(substance => {
			return substance.name;
		});
		const diseases = this.state.patient.diseases.map(disease => {
			return disease.name;
		});
		return (
			 <Collapse>
				 <Panel header="Alergias" key="1" disabled={allergies.length === 0}>
					 <List
						  size="small"
						  bordered
						  dataSource={allergies}
						  renderItem={item => <List.Item>{item}</List.Item>}
					 />
				 </Panel>
				 <Panel header="Medicamentos" key="2" disabled={medications.length === 0}>
					 <List
						  size="small"
						  bordered
						  dataSource={medications}
						  renderItem={item => <List.Item>{item}</List.Item>}
					 />
				 </Panel>
				 <Panel header="Substancias" key="3" disabled={substances.length === 0}>
					 <List
						  size="small"
						  bordered
						  dataSource={substances}
						  renderItem={item => <List.Item>{item}</List.Item>}
					 />
				 </Panel>
				 <Panel header="Enfermadades" key="4" disabled={diseases.length === 0}>
					 <List
						  size="small"
						  bordered
						  dataSource={diseases}
						  renderItem={item => <List.Item>{item}</List.Item>}
					 />
				 </Panel>
			 </Collapse>
		);
	};

	ApptDescription = () => {
		return (
			 <div className={"appt-description"}>
				 {
					 "El anterior viernes sufi una caida en la calle. No sentí nada en ese momento, pero dias despues me empexó a dolor la espalda."
				 }
			 </div>
		);
	};

	goToAppointmentProfile = (e, record) => {
		//const idSale = record.id;
		console.log("Clicked row: ",record);
		this.props.history.push({
			pathname: "appointment_profile",
			search: "?appointmentId=" + record.id+"&patientId="+record.patient.id
		})
	};


	ItemBox = (appt,index) => {
		return(
			 <div className={"itemBox"} key={index}>
				 <Row className={"itembox-fields-ctn"}>
					 <Col span={18}>
						 <Row>
							 <Col span={12}>
								 {this.FieldValue("Fecha de Inicio: ",getDateFromLocalDateTime(appt.creationTimeStamp))}
							 </Col>
							 <Col span={12}>
								 {
									 this.FieldValue
									 ("Fecha de Cierre: ",
										  appt.status === 2 ?
											   getDateFromLocalDateTime(appt.closeTimeStamp) :
											   "En curso"
									 )
								 }
							 </Col>
						 </Row>
					 </Col>
				 </Row>
				 <Row className={"text-buttons-ctn"}>
					 <Col span={18}>
						 {this.ApptDescription()}
					 </Col>
					 <Col span={6} style={{marginTop: 10}}>
						 <Row align="bottom">
							 <Col span={24}>

							 </Col>
						 </Row>
						 <br />
						 <Row>
							 <Col span={24}>
								 <TButton
									  type={"inverse"}
									  label={"Ver más"}
									  size={"expanded"}
									  inverse={true}
									  onClick={e => this.goToAppointmentProfile(e,appt)}
								 />
							 </Col>
						 </Row>
					 </Col>
				 </Row>
			 </div>
		);
	};

	Appointments = () => {
		if(this.state.appointmentPageData.length === 0) return null;
		let boxes = this.state.appointmentPageData[this.state.currentPage].map((item,index) => this.ItemBox(item,index));
		return (
			 <div className={"itemCtn"}>
				 {boxes}
			 </div>
		);
	};

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
			 <React.Fragment>
				 <Row className={"title-ctn"}>
					 <TTitle
						  label={"Historial Médico"}
						  size={"big"}
					 />
				 </Row>
				 {this.state.patient && this.PatientData()}
				 <Row className={"tabs-ctn"}>
					 <Col span={24}>
						 <Tabs defaultActiveKey="1" onChange={this.onChangeTab}>
							 <TabPane tab="Datos médicos" key="1">
								 {this.MedicalData()}
							 </TabPane>
							 <TabPane tab="Consultas" key="2">
								 <Row className={"appointments-ctn"}>
									 <Col span={24} className={"appointments-sub-ctn"}>
										 {this.Appointments()}
									 </Col>
								 </Row>
							 </TabPane>
							 <TabPane tab="Tratamientos" key="3">
								 <Row className={"appointments-ctn"}>
									 <Col span={24} className={"appointments-sub-ctn"}>
										 {this.Treatments()}
									 </Col>
								 </Row>
							 </TabPane>
						 </Tabs>
					 </Col>
				 </Row>
			 </React.Fragment>
		)
	}
}

const mapStateToProps = state => {
	const { appUserReducer } = state;
	const { idCompany } = appUserReducer;
	return {idCompany};
};

export default withRouter(connect(mapStateToProps)(PatientProfile));
