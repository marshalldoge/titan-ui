import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {Row, Col, Input, Button, Select, Drawer, DatePicker, Upload, message} from "antd";
import { SendOutlined, PaperClipOutlined, ThunderboltOutlined, InboxOutlined } from '@ant-design/icons';
import * as constants from "../../constants"
import {connect} from "react-redux";
import moment from "moment";
import "antd/dist/antd.css";
import "./_Conversation.scss";
import loadingChat from'../../assets/gif/loadingChat.gif';
import {
	getJWtProperty,
	getTime,
	getUrlParams,
	parsedFirebaseTime,
	parsedFirebaseDate,
	getAge,
	isToday,
	getCookie, camelize, withParams
} from "../../utils";
import firebase from '../../Firebase';
import 'firebase/firestore';
import LoadingGif from "../../assets/gif/loading.gif";
import Modal from "react-modal";

const firestore = firebase.firestore();

const { Option } = Select;
const { Dragger } = Upload;
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
		messageFile: "",
		actionSelected: "",
		isActionDrawerOpen: false,
		isAttachmentModalOpen: false,
		treatment: {}
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
			appUserId: this.props.doctorAppUserId
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
		if(this.props.appUser === null) return null;
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

	updateFilesSelected = e => {
		let formData  = new FormData();
		formData.append("file",e.target.files[0]);
		this.setState({messageFile:formData});
		console.log("Files updated: ",e.target.files);
		console.log("FILE 0: ",e.target.files[0]);
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
								 <div className={"icon-button attachment"} onClick={() => this.setState({isAttachmentModalOpen: true})}>
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

	multiplierMapping = {
		"0": 86400, //dias
		"1": 3600, //horas
		"2": 60 //minutos
	};

	createAppointmentEvent = () => {
		var headers = {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: getCookie("JWT")
		};
		let me = this;
		let body = JSON.stringify({
			name: "Se ha creado un tratamiento.",
			description: this.state.treatment.description,
			appointmentId: getUrlParams("appointmentId"),
			type: 1

		});
		var url = constants.BACKEND_URL+"/appointmentEvent";
		fetch(url, {
			method: "POST",
			headers: headers,
			body: body
		}).then(response => response.json())
			 .then(function(response) {
			 	me.props.loadAppointmentEvents();
			 }).catch(function(error) {
			console.log(error);
		});
	};

	createTreatment = () => {
		let me = this;
		let treatment = {
			description: this.state.treatment.description,
			recurrence: parseInt(this.state.treatment.recurrence),
			startTimestamp: this.state.treatment.startTimestamp,
			appointmentId: this.props.appointmentId,
			appUserId: this.props.doctorAppUserId,
			interval:
				 parseInt(this.state.treatment.timeInterval) *
				 this.multiplierMapping[this.state.treatment.multiplier]
		};
		firestore.collection("treatments").add(treatment)
			 .then(function(docRef) {
				 console.log("Document written with ID: ", docRef.id);
				 me.createAppointmentEvent();
				 message.success("El tratamiento fue creado con éxito");
				 me.setState({isActionDrawerOpen: false});
			 })
			 .catch(function(error) {
				 console.error("Error adding document: ", error);
			 });
	};

	handleChange = (value) => {
		console.log(`selected ${value}`);

	};

	updateTreatment = (event, name) => {
		let value = event.target.value;
		this.setState(prevState => {
			prevState.treatment = {
				...prevState.treatment,
				[name]: value
			};
			return prevState;
		})
	};

	onDateChange = (date, dateString) => {
		this.setState(prevState => {
			prevState.treatment = {
				...prevState.treatment,
				startTimestamp: dateString
			};
			return prevState;
		})
	};

	handleMultiplier = (value) => {
		this.setState(prevState => {
			prevState.treatment = {
				...prevState.treatment,
				multiplier: value
			};
			return prevState;
		})
	};

	ActionDrawer = () => {
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
						 <Input placeholder="Descripción tratamiento" onChange={(e) => this.updateTreatment(e,"description")} />
					 </Col>
				 </Row>
				 <br/>
				 <Row className={"vehicle-box-row"}>
					 <Col span={24}>
						 <Input placeholder="Número de veces" onChange={(e) => this.updateTreatment(e,"recurrence")}/>
					 </Col>
				 </Row>
				 <br/>
				 <Row className={"vehicle-box-row"}>
					 <Col span={24}>
						 DE: <DatePicker placeholder={"Escoja la fecha de inicio"} onChange={this.onDateChange}/>
					 </Col>
				 </Row>
				 <br/>
				 <Row justify="space-between">
					 <Col span={11}>
						 Cada: <Input
							  style={{ width: '50%' }}
							  placeholder=""
							  onChange={(e) => this.updateTreatment(e,"timeInterval")}
						 />
					 </Col>
					 <Col span={11}>
						 <Select
							  onChange={this.handleMultiplier}
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
							  onClick={this.createTreatment}
						 />
					 </Col>
				 </Row>
				 <br/>

			 </Drawer>
		)
	};

	closeAttachmentModal = () => {
		this.setState({isAttachmentModalOpen: false});
	};


	AttachmentModal = () => {
		const customStyles = {
			content : {
				top                   : '50%',
				left                  : '50%',
				right                 : 'auto',
				bottom                : 'auto',
				marginRight           : '-50%',
				transform             : 'translate(-50%, -50%)',
				width                 : '400px',
				height                : '300px'
			}
		};
		const props = {
			name: 'file',
			multiple: true,
			action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
			onChange(info) {
				const { status } = info.file;
				if (status !== 'uploading') {
					console.log(info.file, info.fileList);
				}
				if (status === 'done') {
					message.success(`${info.file.name} file uploaded successfully.`);
				} else if (status === 'error') {
					message.error(`${info.file.name} file upload failed.`);
				}
			},
		};
		return (
			 <Modal
				  isOpen={this.state.isAttachmentModalOpen}
				  onRequestClose={this.closeAttachmentModal}
				  contentLabel="Enviar archivos"
				  style={customStyles}
				  ariaHideApp={false}
			 >
				 <TTitle
					  size={'big'}
					  label={'Enviar archivos '}
				 />
				 <Row justify={"center"}>
					 <Dragger {...props}>
						 <p className="ant-upload-drag-icon">
							 <InboxOutlined />
						 </p>
						 <p className="ant-upload-text">Haga click aquí o desplaze documentos acá.</p>
					 </Dragger>
				 </Row>
			 </Modal>
		);
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
				 {this.ActionDrawer()}
				 {this.AttachmentModal()}
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
