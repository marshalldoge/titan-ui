import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col, Button } from "antd";
import { getCookie, withParams} from "../../utils.js";
import * as constants from "../../constants"
import {connect} from "react-redux";
import "antd/dist/antd.css";
import "./_OrderTable.scss";

const PaginatedLazyTable= React.lazy(() => import("../../components/PaginatedLazyTable/PaginatedLazyTable"));

class OrderTable extends Component {
    // TODO Add Date of last sale to table
    state={
        columns: [],
        data: [],
        columnDefs: [
            {headerName: "ID", field: "id", width: "10%"},
            {headerName: "Medicamento", field: "itemDescription", width: "30%"},
            {headerName: "Celular", field: "phone", width: "20%"},
            {headerName: "Nombre Persona", field: "clientName", width: "20%"},
	        {headerName: "Precio", field: "price", width: "20%"}
        ],
        windowHeight: document.body.clientHeight
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


    render() {
        console.log("Props: ",this.props);
        console.log("Number of rows in client table: ",Math.floor(this.state.windowHeight/100));
        return (
             <div>
                 <PaginatedLazyTable
                      idCompany={this.props.idCompany}
                      columnDefs={this.state.columnDefs}
                      loadTablePage={this.loadClientTablePage}
                      length={this.props.clientCount}
                      title={"Pedidos"}
                      pageSize={Math.floor(this.state.windowHeight/50)}
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
