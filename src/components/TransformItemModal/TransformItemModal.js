import React, { Component } from "react";
import "../../redux/reducers/appUserReducer";
import Modal from 'react-modal';
import "./_TransformItemModal.scss";
import {Col, Row} from "antd";

const TButton = React.lazy(() => import("../TButton/TButton"));
const Title = React.lazy(() => import("../TTitle/TTitle"));

class TransformItemModal extends Component {

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
				transform             : 'translate(-50%, -50%)'
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
				 <Title level={4}>Transformar {this.props.item.name}</Title>
				 <Row>
					 <Col span={24}>
					 </Col>
				 </Row>
				 <Row>
					 <Col span={12}>
						 <TButton
							  type={"inverse"}
							  //onClick={this.saveSale}
							  label={"CANCELAR"}
							  size={"expanded"}
						 />
					 </Col>
					 <Col span={12}>
						 <TButton
							  type={"inverse"}
							  //onClick={this.saveSale}
							  label={"GUARDAR"}
							  size={"expanded"}
						 />
					 </Col>
				 </Row>
			 </Modal>
		);
	}
}

export default TransformItemModal;
