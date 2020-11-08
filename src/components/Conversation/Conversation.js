import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col, Input, Button } from "antd";
import { SendOutlined } from '@ant-design/icons';
import * as constants from "../../constants"
import {connect} from "react-redux";
import "antd/dist/antd.css";
import "./_Conversation.scss";
import {getJWtProperty, getTime, getUrlParams, parsedFirebaseTime, parsedFirebaseDate} from "../../utils";
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

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

const { TextArea } = Input;
const TTitle = React.lazy(() => import("../TTitle/TTitle"));

class Conversation extends Component {

	state = {
		appointment: null,
		patient: null,
		conversationDates: null,
		messages: null,
		query: null,
		messageText: ""
	};

	componentDidMount() {
		let me = this;
		firestore.collection("messages")
			 .where("appointmentId", "==", this.props.appointmentId)
			 .orderBy("creationTimeStamp","desc")
			 .limit(25)
			 .onSnapshot(function(querySnapshot) {
				 let conversationDates = {};

			 	 for(let i = 0; i < querySnapshot.docs.length; i++) {
			 	 	console.log('processing: ',querySnapshot.docs[i].data());
			 	 	if(conversationDates[parsedFirebaseDate(querySnapshot.docs[i].data().creationTimeStamp)] === undefined) {
					    conversationDates[parsedFirebaseDate(querySnapshot.docs[i].data().creationTimeStamp)] = [];
				    }
					conversationDates[parsedFirebaseDate(querySnapshot.docs[i].data().creationTimeStamp)].push(querySnapshot.docs[i].data());
			     }
			 	 console.log(conversationDates);
				 me.setState({conversationDates: conversationDates});
			 });
		this.handleInputChange = this.handleInputChange.bind(this);
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
			 <Row key={idx}>
				 <Col span={24}>
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

	Conversation = () => {
		if(this.state.conversationDates === null) return null;
		let conversationDates = [];
		let idx = 0;
		for (let date in this.state.conversationDates) {
			if (this.state.conversationDates.hasOwnProperty(date)) {
				conversationDates.push(this.conversationDates(date,this.state.conversationDates[date],idx));
				idx++;
			}
		}
		return (
			 <Row className={"conversation-ctn"}>
				 <Col span={24}>
					 {conversationDates}
				 </Col>
			 </Row>
		)
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
			 <Row justify="space-around" className={""}>
				 <Col span={20}>
					 <TextArea name="messageText" value={this.state.messageText} placeholder="Escribe un mensaje" autoSize onChange={this.handleInputChange}/>
				 </Col>
				 <Col span={3}>
					 <SendOutlined className={"send-icon"} onClick={this.sendMessage}/>
				 </Col>
			 </Row>
		)
	};

	render() {
		return (
			 <React.Fragment>
				 <Row>
					 <Col span={24}>
						 {this.Conversation()}
					 </Col>
				 </Row>
				 <Row>
					 <Col span={24}>
						 {this.MessageTextArea()}
					 </Col>
				 </Row>
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
