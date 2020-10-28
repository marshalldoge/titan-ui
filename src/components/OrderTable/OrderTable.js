import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col, Button } from "antd";
import { getCookie, withParams} from "../../utils.js";
import * as constants from "../../constants"
import {connect} from "react-redux";
import "antd/dist/antd.css";
import "./_OrderTable.scss";

const MessageModal = React.lazy(() => import("../../components/MessageModal/MessageModal"));
const PaginatedLazyTable= React.lazy(() => import("../../components/PaginatedLazyTable/PaginatedLazyTable"));

class OrderTable extends Component {
	constructor(props) {
		super(props);
		this.sendMessage = this.sendMessage.bind(this);
	};
    // TODO Add Date of last sale to table
    state={
        columns: [],
        data: [],
        columnDefs: [
            {headerName: "ID", field: "id", width: "5%"},
            {headerName: "Medicamento", field: "itemDescription", width: "30%"},
            {headerName: "Celular", field: "phone", width: "15%"},
            {headerName: "Nombre Persona", field: "clientName", width: "20%"},
	        {headerName: "Precio", field: "price", width: "20%"},
	        {headerName: "Mensaje",
		        render:(row) =>
			         <Button type="link" size={'small'} onClick={(e) => this.sendMessage(e,row)}>
				         Mensaje
			         </Button>,
		        width: "15%"
	        }
        ],
        windowHeight: document.body.clientHeight,
	    isModalOpen: false,
	    messageInformation: {}
    };

    loadClientTablePage(page) {
        console.log("Loading page: ",page);
        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idCompany: this.props.idCompany,
            page: page,
            pageSize: 25
        };
        const url = withParams(constants.BACKEND_URL + "/Order/paginated", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
             .then(function (response) {
                 //console.log("me in getpage fetch is ",me);
                 if(response.success){
                     //console.log("Page data received: ",response);
                     me.setState ((prevState) =>{
                         prevState.pageData[page]=response.data.content;
                         return prevState;
                     });
                 }
             }).catch(function (error) {
            console.log(error);
        });
    };

	sendMessage(event, row){
		event.stopPropagation();
		console.log("Message sent with information; ",row);
		this.setState(prevState => {
			prevState.messageInformation = row;
			prevState.isModalOpen = true;
			return prevState;
		})
	}


    render() {
        return (
             <div>
                 <PaginatedLazyTable
                      idCompany={this.props.idCompany}
                      columnDefs={this.state.columnDefs}
                      loadTablePage={this.loadClientTablePage}
                      length={this.props.clientCount}
                      title={"Pedidos"}
                      pageSize={Math.floor(this.state.windowHeight/70)}
                 />
	             <MessageModal
		              isOpen={this.state.isModalOpen}
		              messageInformation={this.state.messageInformation}
		              onClose={()=>this.setState({
			              isModalOpen: false
		              })}
	             />
             </div>
        );
    }
}

const mapStateToProps = state => {
    const { appUserReducer, companyReducer } = state;
    const { idCompany } = appUserReducer;
    const { clientCount } = 1;
    console.log("Client count: ",clientCount);
    return {idCompany, clientCount};
};

export default withRouter(connect(mapStateToProps)(OrderTable));
