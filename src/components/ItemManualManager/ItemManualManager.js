import React, { Component} from "react";
import { withRouter} from "react-router-dom";
import {Row, Col, message} from "antd";
import { getCookie} from "../../utils.js";
import "antd/dist/antd.css";
import "./_ItemManualManager.scss";
import {isLetter, withParams} from "../../utils";
import {connect} from "react-redux";
import * as constants from "../../constants";

const Title = React.lazy(() => import("../../components/Title/Title"));
const Button = React.lazy(() => import("../../components/Button/Button"));

class ItemManualManager extends Component {

	state = {
		code: "",
		name: "",
		conversion: "",
		salePrice: "",
		purchasePrice: "",
		minPrice: "",
		description: "",
		warehouses: [],
		parsedConversion: []
	};

	saveManual = () => {
		const headers = {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: getCookie("JWT")
		};
		let me = this;
		let params = {

		};
		//Put 0 instead of "" in warehouse quantities
		let body = JSON.stringify({
			code: this.state.code,
			name: this.state.name,
			description: this.state.description,
			conversion: this.state.conversion,
			idCompany: this.props.idCompany,
			salePrice: parseFloat(this.state.salePrice),
			purchasePrice: parseFloat(this.state.purchasePrice),
			minPrice: parseFloat(this.state.minPrice),
			warehouseItemQuantities: this.state.warehouses.map( x => {
				return {
					name: x.name,
					idWarehouse: x.idWarehouse,
					quantity: x.quantity === "" ? 0 : x.quantity,
					idMeasure: x.idMeasure
				}
			})

		});

		const url = withParams(constants.BACKEND_URL + "/wms/Item", params);
		fetch(url, {
			method: "POST",
			headers: headers,
			body: body
		}).then(response => response.json())
			 .then(function (response) {
				 if(response.success){
					 message.success("El producto se ha creado satisfactoriamente.")
				 }
			 }).catch(function (error) {
			console.log(error);
		});
	};

	handleChange = event => {
		this.setState({[event.target.name]: event.target.value});
	};
	handleWarehouseInputChange = event => {
		let idx = event.target.id;
		let name = event.target.name;
		let value = event.target.value;
		this.setState ((prevState) =>{
			prevState.warehouses[idx][name]=value;
			return prevState;
		});
	};
	handleWarehouseMeasureChange = event => {
		let idx = event.target.id;
		let name = event.target.name;
		let value = event.target.value;
		this.setState ((prevState) =>{
			prevState.warehouses[idx][name] = this.props.nameIdMeasureHashMap[value];
			return prevState;
		});
	};


	componentDidMount() {
		for(let warehouse in this.props.nameIdWarehouseHashMap){
			if(this.props.nameIdWarehouseHashMap.hasOwnProperty(warehouse)) {
				this.setState ((prevState) =>{
					prevState.warehouses.push({
						name: warehouse,
						idWarehouse: this.props.nameIdWarehouseHashMap[warehouse],
						quantity: "",
						idMeasure: 0
					});
					return prevState;
				});
			}
		}
	};

	parseConversion = () => {
		let me = this;
		this.setState ((prevState) =>{
			prevState.parsedConversion = prevState.conversion.split("x");
			for(let i = 0; i < prevState.parsedConversion.length; i++) {
				//console.log("Before: ",prevState.parsedConversion[i]);
				for( let j = 0; j < prevState.parsedConversion[i].length; j++) {
					if(isLetter(prevState.parsedConversion[i].charAt(j))){
						prevState.parsedConversion[i] = prevState.parsedConversion[i].substr(j,prevState.parsedConversion[i].length);
						//console.log("After: ",prevState.parsedConversion[i]);
						break;
					}
				}
				if(i === 0) {
					prevState.warehouses = prevState.warehouses.map( x => {
						console.log("Warehouse: ",x);
						return {
							name: x.name,
							idWarehouse: x.idWarehouse,
							quantity: "",
							idMeasure: me.props.nameIdMeasureHashMap[prevState.parsedConversion[i]]
						}
					});
				}
			}
			console.log("Final state after parsing: ",prevState);
			return prevState;
		});
	};

	MeasureSelect = (index) => {
		let values = [];
		for(let i = 0; i<this.state.parsedConversion.length; i++){
			values.push(
				 <option key={i} value={this.state.parsedConversion[i]}>
					 {this.state.parsedConversion[i]}
				 </option>
			)
		}
		return (
			 <select
				  id={index}
				  name={"idMeasure"}
				  value={this.state.warehouses[index].measure}
				  onChange={this.handleWarehouseMeasureChange}
			 >
				 {values}
			 </select>
		);
	};

	WarehouseInputs = () => {
		let res = [];
		let o = 0;
		for(let i = 0; i<this.state.warehouses.length; i++) {
			res.push(
				 <div key={i}>
					 <Row type={"flex"} justify="space-between">
						 <Col span={6}>
							 <p>{this.state.warehouses[i].name}</p>
						 </Col>
						 <Col span={10}>
							 <input
								  id={i}
								  name={"quantity"}
								  className={"input"}
								  type={"text"}
								  value={this.state.warehouses[i].quantity}
								  placeholder={0}
								  onChange={this.handleWarehouseInputChange}
							 />
						 </Col>
						 <Col span={4}>
							 {this.MeasureSelect(i)}
						 </Col>
					 </Row>
					 <br/>
				 </div>
			);
		}
		return (
			 <Row>
				 {res}
			 </Row>
		)

	};

	saveItemButton = () => {
		return (
			 <Button
				  label={"Mover Items"}
				  size={"small"}
				  onClick={this.saveManual}
				  type={"inverse"}
			 />
		);
	};

	render() {
		return (
			 <div>
				 <Row>
					<Title
						label={"Datos del producto:"}
						size={"medium"}
					/>
				 </Row>
				 <br/>
				 <Row type={"flex"} justify="space-between">
					 <Col span={8}>
						 <input
							  name={"code"}
							  className={"input"}
							  type={"text"}
							  value={this.state.code}
							  placeholder={"Código"}
							  onChange={this.handleChange}
						 />
					 </Col>
					 <Col span={8}>
						 <input
							  name={"name"}
							  className={"input"}
							  type={"text"}
							  value={this.state.name}
							  placeholder={"Nombre"}
							  onChange={this.handleChange}
						 />
					 </Col>
					 <Col span={8}>
						 <input
							  name={"conversion"}
							  className={"input"}
							  type={"text"}
							  value={this.state.conversion}
							  placeholder={"Conversión"}
							  onChange={(event) => {
							  	this.handleChange(event);
							  	this.parseConversion();
							  }}
						 />
					 </Col>
				 </Row>
				 <br/>
				 <Row type={"flex"} justify="space-between">
					 <Col span={8}>
						 <input
							  name={"salePrice"}
							  className={"input"}
							  type={"text"}
							  value={this.state.salePrice}
							  placeholder={"Precio Venta"}
							  onChange={this.handleChange}
						 />
					 </Col>
					 <Col span={8}>
						 <input
							  name={"purchasePrice"}
							  className={"input"}
							  type={"text"}
							  value={this.state.purchasePrice}
							  placeholder={"Precio Compra"}
							  onChange={this.handleChange}
						 />
					 </Col>
					 <Col span={8}>
						 <input
							  name={"minPrice"}
							  className={"input"}
							  type={"text"}
							  value={this.state.minPrice}
							  placeholder={"Precio mínimo"}
							  onChange={this.handleChange}
						 />
					 </Col>
				 </Row>
				 <br/>
				 <Row type={"flex"} justify="space-between">
					 <Col span={24}>
						 <textarea
							  name={"description"}
							  className={"input despcription"}
							  value={this.state.description}
							  placeholder={"Descripción"}
							  onChange={this.handleChange}
							  cols="40"
							  rows="6"
						 />
					 </Col>
				 </Row>
				 <br/>
				 <Row>
					 <Title
						  label={"Almacenes:"}
						  size={"medium"}
					 />
				 </Row>
				 <br/>
				 <Row type={"flex"} justify="space-between">
					 {this.WarehouseInputs()}
				 </Row>
				 <br/>
				 <Row>
					 {this.saveItemButton()}
				 </Row>
			 </div>
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
export default withRouter(connect(mapStateToProps)(ItemManualManager));

