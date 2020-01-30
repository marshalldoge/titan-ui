import React, { Component} from "react";
import { withRouter} from "react-router-dom";
import {Row,Col} from "antd";
import { getCookie} from "../../utils.js";
import "antd/dist/antd.css";
import "./_ItemManualManager.scss";
import {withParams} from "../../utils";
import {connect} from "react-redux";

const Title = React.lazy(() => import("../../components/Title/Title"));

class ItemManualManager extends Component {

	state = {
		code: "",
		name: "",
		conversion: ""
	};

	handleChange = event => {
		this.setState({[event.target.name]: event.target.value});
	};

	render() {
		console.log("Props: ",this.props);
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
							  onChange={this.handleChange}
						 />
					 </Col>
				 </Row>
			 </div>
		);
	}
}

const mapStateToProps = state => {
	const { appUserReducer } = state;
	const { idCompany } = appUserReducer;
	console.log("idCompany for tableUser: ",idCompany);
	return {idCompany};
};
export default withRouter(connect(mapStateToProps)(ItemManualManager));

