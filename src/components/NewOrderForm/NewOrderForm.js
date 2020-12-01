import React, {Component } from "react";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Tooltip, message, Row, Col, AutoComplete } from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
// routes config
import * as constants from "../../constants";
import {getCookie} from "../../utils";
import {withRouter} from "react-router";
import {connect} from "react-redux";

const TTitle = React.lazy(() => import("../TTitle/TTitle"));
const TButton= React.lazy(() => import("../TButton/TButton"));

class NewOrderForm extends Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

    state = {
        confirmDirty: false,
        autoCompleteResult: [],
	    cellphone: "",
	    itemValue: "",
	    firstName: "",
	    lastName: "",
	    options: "",
	    optionsMedicamento: "",
	    cellPhoneValue: ""
    };

	goToOrder = () => {
		this.props.history.push("/Order");
	};

    handleSubmit = e => {
	    let me = this;
	    //console.log("Received values of form: ", values);

	    // Default options are marked with *
	    var data = JSON.stringify({
		    itemDescription: this.state.itemValue,
	        phone: this.state.cellPhoneValue,
	        clientName: this.state.firstName + " " + this.state.lastName,
	        active: true
	    });
	    var url = constants.BACKEND_URL+"/Order";
	    fetch(url, {
		    method: "POST",
		    body: data,
		    headers: {
			    "Content-Type": "application/json; charset=utf-8",
			    "Authorization":getCookie("JWT")
		    }
	    }).then(function (res) {
		    if (res.status == "200") {
			    console.log("Success");
			    me.goToOrder();
			    message.success("Se ha guardado el pedido correctamente.");
			    //var jwt = parseJwt(res.headers.get("Authorization"));
			    //var json=JSON.parse(jwt);

		    } else {
			    /*var ele = document.getElementById("mensaje");
				var alerta = document.createElement("DIV");
				alerta.className = "alert alert-danger";
				alerta.innerHTML = "Su contraseña o usuario son incorrectos.";
				console.log("Mostrando alerta: ", alerta);
				ele.appendChild(alerta);
			*/
		    }
	    });
    };

	onSearch = (searchText) => {
		let newOptions = [];
		for(let i = 0; i < this.props.phoneArray.length; i++) {
			if(this.props.phoneArray[i].includes(searchText)) {
				newOptions.push({
					value: this.props.phoneArray[i]
				});
			}
		}
		this.setState({
			options: !searchText ? [] : newOptions
		});
	};

	onSelect = (data) => {
		console.log('onSelect', data);
		if(this.props.phoneClientHashMap[data] !== undefined) {
			this.setState({
				firstName: this.props.phoneClientHashMap[data].firstName,
				lastName: this.props.phoneClientHashMap[data].lastName,
				cellPhoneValue: data
			})
		}
	};
	onChange = (data) => {
		this.setState({
			cellPhoneValue: data
		})
	};

	onSearchMedicamento = (searchText) => {
		console.log('SearchText: ',searchText);
		let newOptions = [];
		for(let i = 0; i < this.props.itemNameArray.length; i++) {
			console.log('item: ',this.props.itemNameArray[i]);
			if(this.props.itemNameArray[i].toLowerCase().includes(searchText.toLowerCase())) {
				newOptions.push({
					value: this.props.itemNameArray[i]
				});
			}
		}
		this.setState({
			optionsMedicamento: !searchText ? [] : newOptions
		});
	};

	onSelectMedicamento = (data) => {
		console.log('onSelect', data);
		this.setState({
			itemValue: data
		})
	};
	onChangeMedicamento = (data) => {
		this.setState({
			itemValue: data
		})
	};

    render() {
        return (
	         <div>
		         <TTitle
			          label={"Nuevo pedido"}
			          size={"big"}
			          icon={"edit"}
		         />
		         <Row>
			         <Col span={4}>
				         {"Celular"}
			         </Col>
			         <Col span={19} offset={1}>
				         <AutoComplete
					          options={this.state.options}
					          style={{ width: 300 }}
					          onSelect={this.onSelect}
					          onSearch={this.onSearch}
					          placeholder="Celular"
					          onChange={this.onChange}
				         />
			         </Col>
		         </Row>
		         <br/>
		         <Row>
			         <Col span={4}>
				         {"Nombre"}
			         </Col>
			         <Col span={19} offset={1}>
				         <Input placeholder="Nombre" value={this.state.firstName} onChange={(e) => this.setState({firstName: e.target.value})}/>
			         </Col>
		         </Row>
		         <br/>
		         <Row>
			         <Col span={4}>
				         {"Apellidos"}
			         </Col>
			         <Col span={19} offset={1}>
				         <Input placeholder="Apellidos" value={this.state.lastName} onChange={(e) => this.setState({lastName: e.target.value})}/>
			         </Col>
		         </Row>
		         <br/>
		         <Row>
			         <Col span={4}>
				         {"Medicamento"}
			         </Col>
			         <Col span={19} offset={1}>
				         <AutoComplete
					          options={this.state.optionsMedicamento}
					          style={{ width: 500 }}
					          onSelect={this.onSelectMedicamento}
					          onSearch={this.onSearchMedicamento}
					          placeholder="Item"
					          onChange={this.onChangeMedicamento}
				         />
			         </Col>
		         </Row>
		         <br/>
		         <Row>
			         <Col span={20} offset={4}>
				         <TButton
					          label={"Guardar Pedido"}
					          size={"medium"}
					          onClick={this.handleSubmit}
					          type={"inverse"}
				         />
			         </Col>
		         </Row>

	         </div>
        );
    }
}
const mapStateToProps = state => {
	const { clientReducer, itemQuantityReducer } = state;
	const {phoneArray, phoneClientHashMap} = clientReducer;
	const {nameItemHashMap, itemNameArray} = itemQuantityReducer;
	console.log('itemQuantityReducer: ',itemQuantityReducer);
	return {phoneArray, phoneClientHashMap, nameItemHashMap, itemNameArray};
};
export default withRouter(connect(mapStateToProps)(NewOrderForm));
