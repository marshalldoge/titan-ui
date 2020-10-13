import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Col, Row} from "antd";

const OrderTable= React.lazy(() => import("../../components/OrderTable/OrderTable"));
const Button= React.lazy(() => import("../../components/TButton/TButton"));

class Order extends Component{

	state={

	};

	componentDidMount() {
		//this.loadItemFields();
		//this.loadDestinationWarehouse();
	}

	goToItemManager = () => {
		this.props.history.push("/NewOrderForm");
	};

	addItemButton = () => {
		return (
			 <Button
				  label={"Añadir Items"}
				  size={"small"}
				  onClick={this.goToItemManager}
				  type={"inverse"}
			 />
		);
	};


	render() {
		return (
			 <div>
				 <OrderTable/>
				 <br />
				 <Row type={"flex"} justify={"start"}>
					 <Col span={4}>
						 {this.addItemButton()}
					 </Col>
				 </Row>
			 </div>
		);
	}
}

const mapStateToProps = state => {
	const { appUserReducer, moduleReducer } = state;
	const { idCompany, idAppUser} = appUserReducer;
	const { modules } = moduleReducer;
	console.log("idCompany for tableUser: ",idCompany);
	return {idCompany, idAppUser, modules};
};

export default withRouter(connect(mapStateToProps)(Order));