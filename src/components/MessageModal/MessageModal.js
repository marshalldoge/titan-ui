import React, { Component } from "react";
import "../../redux/reducers/appUserReducer";
import Modal from 'react-modal';
import "./_MessageModal.scss";
import {Col, Row, Checkbox, message, Input} from "antd";
import { getMeasureName, getMeasureQuantity, isLetter, isNumber} from "../../utils.js";
import {getCookie, withParams} from "../../utils";
import {BACKEND_URL} from "../../constants";
import {connect} from "react-redux";

const { TextArea } = Input;
const TButton = React.lazy(() => import("../TButton/TButton"));
const Title = React.lazy(() => import("../TTitle/TTitle"));

class TransformItemModal extends Component {

	state = {
		message: ""
	};

	componentDidMount() {
		this.setState({
			message: "Su pedido ya esta disponible. Puede recogerlo, a partir de mañana en horarios de oficina."
		})
	}

	sendMessage = () => {
		let me = this;
		let headers={
			"Authorization":getCookie("JWT"),
			"Content-Type": "application/json; charset=utf-8",
		};
		let params = {
			idItemOrder: this.props.messageInformation.id
		};
		console.log('Props: ',this.props);
		let body = JSON.stringify({
			phone: "+591"+this.props.messageInformation.phone,
			message: this.state.message
		});
		let url = withParams(BACKEND_URL + "/SMS",params);
		fetch(url, {
			method: "POST",
			body: body,
			headers: headers
		}).then(function (res) {
			if (res.ok) {
				me.props.onClose();
				message.success("Se ha enviado el mensaje con éxito.");
			} else if (res.status === 401) {
				alert("Oops! ");
			}
		}, function (e) {
			alert("Error al enviar el mensaje.");
		});
	};

	render() {
		let me = this;
		function afterOpenModal() {
			// references are now sync'd and can be accessed.
			console.log("AFTER MODAL IS OPEN");
		}

		const customStyles = {
			content : {
				top                   : '50%',
				left                  : '50%',
				right                 : 'auto',
				bottom                : 'auto',
				marginRight           : '-50%',
				transform             : 'translate(-50%, -50%)',
				width                 : '450px',
				height                : '230px'
			}
		};
		return (
			 <Modal
				  isOpen={this.props.isOpen}
				  onAfterOpen={afterOpenModal}
				  onRequestClose={this.props.onClose}
				  style={customStyles}
				  contentLabel="Noticiación"
				  ariaHideApp={false}
			 >
				 <Title
					  size={'medium'}
					  label={'Mandar mensaje'}
				 />
				 <Title
					  size={'small'}
					  label={"Cel: " + this.props.messageInformation.phone}
				 />
				 <Row justify="space-between" align="bottom">
					 <Col span={24}>
						 <TextArea
							  showCount={true}
							  maxLength={100}
							  value={this.state.message}
							  onChange={(e) => this.setState({message: e.target.value})}/>
					 </Col>
				 </Row>
				 <br />
				 <Row justify="space-between" align="bottom">
					 <Col span={10}>
						 <TButton
							  type={"inverse"}
							  onClick={this.props.onClose}
							  label={"CANCELAR"}
							  size={"small"}
						 />
					 </Col>
					 <Col span={10}>
						 <TButton
							  type={"inverse"}
							  onClick={this.sendMessage}
							  label={"ENVIAR"}
							  size={"small"}
						 />
					 </Col>
				 </Row>
			 </Modal>
		);
	}
}
const mapStateToProps = state => {
	const { appUserReducer, warehouseReducer, measureReducer } = state;
	const { idCompany } = appUserReducer;
	const { nameIdMeasureHashMap } = measureReducer;
	const { nameIdWarehouseHashMap } = warehouseReducer;
	return {idCompany, nameIdWarehouseHashMap, nameIdMeasureHashMap};
};
export default connect(mapStateToProps)(TransformItemModal);
