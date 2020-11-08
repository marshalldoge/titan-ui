import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col, Button } from "antd";
import { getCookie, withParams} from "../../utils.js";
import * as constants from "../../constants"
import {connect} from "react-redux";
import "antd/dist/antd.css";
import "./_AppointmentProfile.scss";
import {getJWtProperty, getTime, getUrlParams} from "../../utils";

const TTitle = React.lazy(() => import("../TTitle/TTitle"));
const Conversation = React.lazy(() => import("../Conversation/Conversation"));

class AppointmentProfile extends Component {

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
				 me.setState({
					 patient: response.data
				 })
			 }).catch(function(error) {
			console.log(error);
		});
	}

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
			 <React.Fragment>
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
						 {this.FieldValue("Edad: ",this.state.patient.appUser.color)}
					 </Col>
				 </Row>
				 <Row className={"this.state.drawerVehicleData-box-row"}>
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
			 </React.Fragment>
		)
	};

	render() {
		return (
			 <React.Fragment>
				<Row>
					<Col>
						<TTitle
							 label={"Consulta "}
							 size={"big"}
							 onClick={() => this.props.onEditClick(this.props.person)}
						/>
					</Col>
				</Row>
				 <Row>
					 <Col>
						 <TTitle
							  label={"Paciente "}
							  size={"medium"}
							  onClick={() => this.props.onEditClick(this.props.person)}
						 />
					 </Col>
				 </Row>
				 {this.PatientData()}
				 <Row>
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
			 </React.Fragment>
		);
	}
}

const mapStateToProps = state => {
	const { appUserReducer } = state;
	const { appUser } = appUserReducer;
	return {appUser};
};

export default withRouter(connect(mapStateToProps)(AppointmentProfile));
