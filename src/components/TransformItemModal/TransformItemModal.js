import React, { Component } from "react";
import "../../redux/reducers/appUserReducer";
import Modal from 'react-modal';
import "./_TransformItemModal.scss";
import {Col, Row, Checkbox, Radio, Input} from "antd";
import { getMeasureName, getMeasureQuantity, isLetter, isNumber} from "../../utils.js";

const TButton = React.lazy(() => import("../TButton/TButton"));
const Title = React.lazy(() => import("../TTitle/TTitle"));

class TransformItemModal extends Component {

	state = {
		warehouses: [],
		warehouseOriginCheckboxes: [],
		warehouseDestinyRadioButtons: [],
		measures: [],
		measureOriginCheckboxes: [],
		measureDestinyRadioButtons: [],
		measuresAgregattedCurrentStock: [],
		measuresTransformStock: [],
		measuresTransformStockDanger: [],
		measuresDestinyTransformStock: [],
		transformIsValid: false
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.item !== prevProps.item) {
			this.setWarehouses();
		}
	}

	setWarehouses = () => {
		if(this.props.item['warehouseStock']){
			this.setState(prevState => {
				let warehouses = [];
				let measures = [];
				let warehouseOriginCheckboxes = [];
				for(let i = 0; i < this.props.item['warehouseStock'].length; i++) {
					warehouses.push(this.props.item.warehouseStock[i].warehouseName);
					warehouseOriginCheckboxes.push(false);
					prevState.warehouseDestinyRadioButtons.push(false);
				}
				for (let measure in this.props.item['warehouseStock'][0].stock) {
					if (Object.prototype.hasOwnProperty.call(this.props.item['warehouseStock'][0].stock, measure)) {
						measures.push(measure);
						prevState.measureDestinyRadioButtons.push(false);
						prevState.measuresAgregattedCurrentStock.push(0);
						prevState.measuresTransformStock.push("");
						prevState.measuresTransformStockDanger.push(false);
						prevState.measuresDestinyTransformStock.push(0);
					}
				}
				prevState.warehouses = warehouses;
				prevState.warehouseOriginCheckboxes = warehouseOriginCheckboxes;
				prevState.measures = measures;
				return prevState;
			});
		}
	};

	// Function to transform an item measure to another
	transform = (conversion, originMeasure, originQuantity, destinyMeasure) => {
		console.log('Conversion: ',conversion);
		console.log('OriginMeasure: ',originMeasure);
		console.log('OriginQuantity',originQuantity);
		console.log('DestinyMeasure:',destinyMeasure);
		let res = 0;
		let measures = conversion.split('x');
		let posOrigin = 0;
		let posDestiny = 0;
		for(let i = 0; i < measures.length; i++) {
			if(originMeasure === getMeasureName(measures[i])) {
				posOrigin = i;
			}
			if(destinyMeasure === getMeasureName(measures[i])) {
				posDestiny = i;
			}
		}
		let start = Math.min(posOrigin,posDestiny);
		let end = Math.max(posOrigin,posDestiny);
		let equivalence = 1;
		for(let i = start; i < end; i++) {
			equivalence *= getMeasureQuantity(measures[i]);
		}
		if(posOrigin < posDestiny) {
			//Means we want to transform from an small measure to a big one
			res = originQuantity / equivalence;
		} else {
			res = originQuantity * equivalence;
		}
		console.log('Value: ',res);
		return res;
	};

	checkOriginWarehouse(e,idx) {
		this.setState(prevState => {
			prevState.warehouseOriginCheckboxes[idx] = !prevState.warehouseOriginCheckboxes[idx];
			// Empty all aggregated values in measures
			for(let i = 0; i < prevState.measuresAgregattedCurrentStock.length; i++) {
				prevState.measuresAgregattedCurrentStock[i] = 0;
			}
			for(let i = 0; i < this.props.item['warehouseStock'].length; i++) {
				// Check if warehouse if selected
				if(prevState.warehouseOriginCheckboxes[i] === true) {
					let j = 0;
					for (let measure in this.props.item['warehouseStock'][i].stock) {
						if (Object.prototype.hasOwnProperty.call(this.props.item['warehouseStock'][i].stock, measure)) {
							prevState.measuresAgregattedCurrentStock[j] += this.props.item['warehouseStock'][i].stock[measure];
						}
						j++;
					}
				}
			}
			return prevState;
		});
		this.validateForm();
	};

	validateForm = () => {

		let transformIsValid = true;
		this.setState(prevState => {
			//Validate if transform measures
			for(let i = 0; i < prevState.measures.length; i++) {
				prevState.measuresTransformStockDanger[i] =
					 parseFloat(prevState.measuresTransformStock[i]) > parseFloat(prevState.measuresAgregattedCurrentStock[i]);
				transformIsValid = transformIsValid && !prevState.measuresTransformStockDanger[i];
			}
			//Validate if at least 1 measure and 1 warehouse are selected
			let isDestinyMeasureSelected = false;
			let isDestinyWarehouseSelected = false;
			for(let i = 0; i < prevState.warehouseDestinyRadioButtons.length; i++) {
				isDestinyWarehouseSelected = prevState.warehouseDestinyRadioButtons[i] || isDestinyWarehouseSelected;
			}

			for(let i = 0; i < prevState.measureDestinyRadioButtons.length; i++) {
				isDestinyMeasureSelected = prevState.warehouseDestinyRadioButtons[i] || isDestinyMeasureSelected;
			}
			prevState.transformIsValid = transformIsValid && isDestinyMeasureSelected && isDestinyWarehouseSelected;

			return prevState;
		});
	};

	checkOriginMeasure(e,idx) {
		this.setState(prevState => {
			prevState.measureOriginCheckboxes[idx] = !prevState.measureOriginCheckboxes[idx];
			return prevState;
		});
	};

	onChangeMeasuresTransformStock(e,idx) {
		let value = e.target.value;
		this.setState(prevState => {
			if(value.length === 0 || isNumber(value.charAt(value.length - 1))) {
				prevState.measuresTransformStock[idx] = value;
			}
			//Update destiny measures
			for(let i = 0; i < prevState.measuresDestinyTransformStock.length; i++) {
				prevState.measuresDestinyTransformStock[i] =
					 this.transform(
					 	 this.props.item.conversion,
						  prevState.measures[idx],
						  prevState.measuresTransformStock[idx],
						  prevState.measures[i]
						  );
			}
			return prevState;
		});
		this.validateForm();
	};

	checkDestinyWarehouse(e,idx) {
		this.setState(prevState => {
			for(let i = 0; i < prevState.warehouseDestinyRadioButtons.length; i++) {
				prevState.warehouseDestinyRadioButtons[i] = (idx === i);
			}
			return prevState;
		});
	};

	checkDestinyMeasure(e,idx) {
		this.setState(prevState => {
			for(let i = 0; i < prevState.measureDestinyRadioButtons.length; i++) {
				prevState.measureDestinyRadioButtons[i] = (idx === i);
			}
			return prevState;
		});
	};

	originWarehouseList = () => {
		let warehouses = [];
		for(let i = 0; i < this.state.warehouses.length; i++) {
			warehouses.push(
				 <Row key={i}>
					 <Col span={24}>
						 <Checkbox
							  checked={this.state.warehouseOriginCheckboxes[i]}
							  onChange={(e) => this.checkOriginWarehouse(e,i)}
						 >{this.state.warehouses[i]}
						 </Checkbox>
					 </Col>
				 </Row>
			);
		}
		return warehouses;
	};

	originMeasureList = () => {
		let measures = [];
		for(let i = 0; i < this.state.measures.length; i++) {
			let danger = this.state.measuresTransformStockDanger[i] ? "danger" : "";
			measures.push(
				 <Row key={i}>
					 <Col span={24}>
						 {this.state.measures[i] + ' ' + this.state.measuresAgregattedCurrentStock[i]}
						 <input
							  name={"measureInput"}
							  className={"measureInput "+danger}
							  value={this.state.measuresTransformStock[i]}
							  placeholder={"0"}
							  onChange={(e) => this.onChangeMeasuresTransformStock(e,i)}
						 />
					 </Col>
				 </Row>
			);
			/*
			measures.push(
				 <Row key={i}>
					 <Col span={24}>
						 <Checkbox
							  checked = {this.state.measureOriginCheckboxes[i]}
							  onChange = {(e) => this.checkOriginMeasure(e,i)}
						 >
							 {this.state.measures[i] + ' ' + this.state.measuresAgregattedCurrentStock[i]}
							 <input
								  name={"measureInput"}
								  className={"measureInput "+danger}
								  value={this.state.measuresTransformStock[i]}
								  placeholder={"0"}
								  onChange={(e) => this.onChangeMeasuresTransformStock(e,i)}
							 />
						 </Checkbox>
					 </Col>
				 </Row>
			);
			 */
		}
		return measures;
	};

	destinyWarehouseList = () => {
		let warehouses = [];
		for(let i = 0; i < this.state.warehouses.length; i++) {
			console.log('pushing: ',this.state.warehouses[i]);
			warehouses.push(
				 <Row key={i}>
					 <Col span={24}>
						 <Radio
							  checked={this.state.warehouseDestinyRadioButtons[i]}
							  onChange={(e) => this.checkDestinyWarehouse(e,i)}>{this.state.warehouses[i]}
						 </Radio>
					 </Col>
				 </Row>
			);
		}
		return warehouses;
	};

	destinyMeasureList = () => {
		let measures = [];
		for(let i = 0; i < this.state.measures.length; i++) {
			measures.push(
				 <Row key={i}>
					 <Col span={24}>
						 <Radio
							  checked={this.state.measureDestinyRadioButtons[i]}
							  onChange={(e) => this.checkDestinyMeasure(e,i)}>
							 {this.state.measures[i] + ' ' + parseFloat(this.state.measuresDestinyTransformStock[i]).toFixed(3)}
						 </Radio>
					 </Col>
				 </Row>
			);
		}
		return measures;
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
				width                 : '500px',
				height                : '520px'
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
					  size={'big'}
					  label={'Transformar ' + this.props.item.code}
				 />
				 <Row justify={"space-between"}>
					 <Col span={11}>
						 <Row>
							 <Title
								  size={'medium'}
								  label={'Origen'}
							 />
						 </Row>
						 <Row>
							 <Title
								  size={'small'}
								  label={'Almacenes'}
							 />
							 <Col span={24}>
								 {this.originWarehouseList()}
							 </Col>
						 </Row>
						 <br/>
						 <Row>
							 <Title
								  size={'small'}
								  label={'Métrica'}
							 />
							 <Col span={24}>
								 {this.originMeasureList()}
							 </Col>
						 </Row>
					 </Col>
					 <Col span={11}>
						 <Row>
							 <Title
								  size={'medium'}
								  label={'Destino'}
							 />
						 </Row>
						 <Row>
							 <Title
								  size={'small'}
								  label={'Almacenes'}
							 />
							 <Col span={24}>
								 {this.destinyWarehouseList()}
							 </Col>
						 </Row>
						 <br/>
						 <Row>
							 <Title
								  size={'small'}
								  label={'Métrica'}
							 />
							 <Col span={24}>
								 {this.destinyMeasureList()}
							 </Col>
						 </Row>
					 </Col>
				 </Row>
				 <br/>
				 <Row justify="space-between" align="bottom">
					 <Col span={11}>
						 <TButton
							  type={"inverse"}
							  onClick={this.props.onClose}
							  label={"CANCELAR"}
							  size={"expanded"}
						 />
					 </Col>
					 <Col span={11}>
						 <TButton
							  disabled={!this.state.transformIsValid}
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
