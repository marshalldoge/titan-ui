import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {Row, Col, Input, Button, Select, Drawer, DatePicker} from "antd";
import { SendOutlined, PaperClipOutlined, ThunderboltOutlined } from '@ant-design/icons';
import * as constants from "../../constants"
import {connect} from "react-redux";
import moment from "moment";
import "antd/dist/antd.css";
import "./_Conversation.scss";
import loadingChat from'../../assets/gif/loadingChat.gif';
import {getJWtProperty, getTime, getUrlParams, parsedFirebaseTime, parsedFirebaseDate, getAge, isToday} from "../../utils";
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import LoadingGif from "../../assets/gif/loading.gif";

firebase.initializeApp({
	apiKey: "AIzaSyClRs3Xkafgy4TNUA9vfFz8RjHLG3ZHMaU",
	authDomain: "titan-health.firebaseapp.com",
	databaseURL: "https://titan-health.firebaseio.com",
	projectId: "titan-health",
	storageBucket: "titan-health.appspot.com",
	messagingSenderId: "562863710701",
	appId: "1:562863710701:web:fa4cbc372b7f10c35007e4",
	measurementId: "G-727QQ9J50P"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

const { Option } = Select;
const { TextArea } = Input;
const TTitle = React.lazy(() => import("../TTitle/TTitle"));
const TButton = React.lazy(() => import("../TButton/TButton"));

class Conversation extends Component {

	constructor(props) {
		super(props);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.el = React.createRef();
	}


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
		let me = this;
		firestore.collection("messages")
			 .where("appointmentId", "==", this.props.appointmentId)
			 .orderBy("creationTimeStamp","asc")
			 .limit(25)
			 .onSnapshot(function(querySnapshot) {
				 let conversationDates = {};

			 	 for(let i = 0; i < querySnapshot.docs.length; i++) {
			 	 	console.log('processing: ',querySnapshot.docs[i].data());
			 	 	let creationTimeStamp = parsedFirebaseDate(querySnapshot.docs[i].data().creationTimeStamp);
				     if(querySnapshot.docs[i].data().creationTimeStamp !== null && isToday(querySnapshot.docs[i].data().creationTimeStamp)) {
					     creationTimeStamp = "Hoy";
				     }
			 	 	if(conversationDates[creationTimeStamp] === undefined) {
					    conversationDates[creationTimeStamp] = [];
				    }
					conversationDates[creationTimeStamp].push(querySnapshot.docs[i].data());
			     }
			 	 console.log(conversationDates);
				 me.setState({conversationDates: conversationDates});
			 });
		this.scrollToBottom()
	}

	componentDidUpdate () {
		this.scrollToBottom()
	}
	scrollToBottom() {
		this.el.current.scrollTop = this.el.current.scrollHeight;
	}

	sendMessage = () => {
		let message = {
			text: this.state.messageText,
			creationTimeStamp: firebase.firestore.FieldValue.serverTimestamp(),
			appointmentId: this.props.appointmentId,
			appUserId: this.props.doctorId
		};
		firestore.collection("messages").add(message)
			 .then(function(docRef) {
				 console.log("Document written with ID: ", docRef.id);
			 })
			 .catch(function(error) {
				 console.error("Error adding document: ", error);
			 });
	};

	Message = (message,idx) => {
		return (
			 <Row key={idx} className={"message-ctn"}>
				 <Col span={24} className={"message-sub-ctn"}>
					 <Row>
						 <span className={"appUser-name"}>{this.props.appUser[message.appUserId].firstName + " " + this.props.appUser[message.appUserId].lastName}</span>
						 <span className={"space-name-time"}/>
						 <span className={"message-time"}>{parsedFirebaseTime(message.creationTimeStamp)}</span>
					 </Row>
					 <Row>
						 {message.text}
					 </Row>
				 </Col>
			 </Row>
		)
	};

	conversationDates = (date ,messages, idx) => {
		let messagesCmps = messages.map((message,idx) => this.Message(message,idx));
		return (
			 <Row key={idx}>
				 <Col span={24}>
					 <Row key={idx} justify="center" className={"date-ctn"}>
						 {date}
					 </Row>
					 <br/>
					 <Col span={24}>
						 {messagesCmps}
					 </Col>
				 </Col>
			 </Row>
		)
	};

	loadingConversation = () => {
		return (
			 <Row justify={"center"}>
				 <Col span={5}>
					 <div style={{width:"100px",height:"60px",verticalAlign:"middle",textAlign:"center",paddingTop:"40px"}}>
						 <img style={{width:"100px",height:"60px"}} src={loadingChat} alt={"Cargando..."}/>
					 </div>
				 </Col>
			 </Row>
		);
	};

	Conversation = () => {
		if(this.state.conversationDates === null) return this.loadingConversation();
		let conversationDates = [];
		let idx = 0;
		for (let date in this.state.conversationDates) {
			if (this.state.conversationDates.hasOwnProperty(date)) {
				conversationDates.push(this.conversationDates(date,this.state.conversationDates[date],idx));
				idx++;
			}
		}
		return (
			 <React.Fragment>
				 {conversationDates}
			 </React.Fragment>
		);
	};

	handleInputChange(event) {
		let me = this;
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		me.setState({
			[name]: value
		});
	}

	MessageTextArea = () => {
		return (
			 <Row className={"message-text-area-ctn"}>
				 <Col span={24} className={"message-text-area-sub-ctn"}>
					 <Row justify="space-around">
						 <Col span={24}>
							 <TextArea name="messageText" value={this.state.messageText} placeholder="Escribe un mensaje" autoSize onChange={this.handleInputChange}/>
						 </Col>
					 </Row>
					 <Row className={"message-text-buttons-ctn"} align={"middle"} justify={"start"}>
						 <Col span={3}>
							 <div className={"icon-button action"} onClick={() => this.setState({isActionDrawerOpen: true})}>
								 <ThunderboltOutlined className={"icon"}/>
							 </div>
						 </Col>
						 <Col span={3} offset={15}>
							 <Row justify={"end"}>
								 <div className={"icon-button attachment"}>
									 <PaperClipOutlined className={"icon"}/>
								 </div>
							 </Row>
						 </Col>
						 <Col span={3} className={"message-text-buttons-sub-ctn"}>
							 <Row justify={"center"} align="middle">
								 <div className={"icon-button send"} onClick={this.sendMessage}>
								    <SendOutlined className={"icon"}/>
								 </div>
							 </Row>
						 </Col>
					 </Row>
				 </Col>
			 </Row>
		)
	};

	handleChange = (value) => {
		console.log(`selected ${value}`);
	};

	Drawer = () => {
		return (
			 <Drawer
				  placement="right"
				  closable={true}
				  onClose={()=>this.setState({isActionDrawerOpen: false})}
				  visible={this.state.isActionDrawerOpen}
				  width={600}
			 >
				 <Row className={"vehicle-box-row"}>
					 <Col span={24}>
						 <TTitle
							  label={"Acciones"}
							  size={"medium"}
						 />
					 </Col>
				 </Row>
				 <Row className={"vehicle-box-row"}>
					 <Col span={24}>
						 <Select
							  style={{ width: '100%' }}
							  onChange={this.handleChange}
							  placeholder={"Escoja la acción..."}
						 >
							 <Option value="0">Crear tratamiento</Option>
							 <Option value="1">Notificar</Option>
							 <Option value="2">Mandar correo con contactos</Option>
						 </Select>
					 </Col>
				 </Row>
				 <br/>
				 <Row className={"vehicle-box-row"}>
					 <Col span={24}>
						 <Input placeholder="Nombre del medicamento" />
					 </Col>
				 </Row>
				 <br/>
				 <Row className={"vehicle-box-row"}>
					 <Col span={24}>
						 DE: <DatePicker placeholder={"Escoja la fecha de inicio"}/>
					 </Col>
				 </Row>
				 <br/>
				 <Row className={"vehicle-box-row"}>
					 <Col span={24}>
						 A: <DatePicker placeholder={"Escoja la fecha de fin"}/>
					 </Col>
				 </Row>
				 <br/>
				 <Row justify="space-between">
					 <Col span={11}>
						 Cada: <Input
							  style={{ width: '50%' }}
							  placeholder=""
						 />
					 </Col>
					 <Col span={11}>
						 <Select
							  onChange={this.handleChange}
							  placeholder={"Tiempo..."}
						 >
							 <Option value="0">Dias</Option>
							 <Option value="1">Horas</Option>
							 <Option value="2">Minutos</Option>
						 </Select>
					 </Col>
				 </Row>
				 <br/>
				 <Row className={"vehicle-box-row"}>
					 <Col span={24}>
						 <TButton
							  label={"CREAR"}
							  type={"inverse"}
							  size={"expanded"}
						 />
					 </Col>
				 </Row>
				 <br/>

			 </Drawer>
		)
	};


	render() {
		return (
			 <React.Fragment>
				 <div className={"conversation-ctn"} ref={this.el}>
					 <Row>
						 <Col span={24}>
							 {this.Conversation()}
						 </Col>
					 </Row>
				 </div>
				 {this.MessageTextArea()}
				 {this.Drawer()}
			 </React.Fragment>
		);
	}
}

const mapStateToProps = state => {
	const { appUserReducer } = state;
	const { idCompany } = appUserReducer;
	return {idCompany};
};

export default withRouter(connect(mapStateToProps)(Conversation));
