import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Col, Row} from "antd";

const SearchAppointmentTable = React.lazy(() => import("../../components/SearchAppointmentTable/SearchAppointmentTable"));
const Button = React.lazy(() => import("../../components/TButton/TButton"));

class SearchAppointment extends Component{

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
				  label={"Nuevo pedido"}
				  size={"small"}
				  onClick={this.goToItemManager}
				  type={"inverse"}
			 />
		);
	};


	render() {
		return (
			 <div>
				 <SearchAppointmentTable/>
				 <br />
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

export default withRouter(connect(mapStateToProps)(SearchAppointment));
