import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Table } from "antd";
import { getCookie, withParams, parseTime} from "../../utils.js";
import * as constants from "../../constants"
import {connect} from "react-redux";
import "antd/dist/antd.css";
import "../../stylesheets/components/appUserTable/_appUserTable.scss";

const PaginatedLazyTable= React.lazy(() => import("../../components/PaginatedLazyTable/PaginatedLazyTable"));

class ClientTable extends Component {
    // TODO Add Date of last sale to table
    state={
        columns: [],
        data: [],
        columnDefs: [
            {headerName: "ID", field: "id", width: "10%"},
            {headerName: "Nombre", field: "fullName", width: "30%"},
            {headerName: "Nit", field: "nit", width: "20%"},
            {headerName: "Celular", field: "cellphone", width: "20%"},
            {headerName: "Ultima Venta", field: "lastSaleTimeStamp", width: "20%"}
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
            page: page
        };
        const url = withParams(constants.BACKEND_URL + "/Client/findByIdCompanyPaginated", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function (response) {
                //console.log("me in getpage fetch is ",me);
                if(response.success){
                    //console.log("Page data received: ",response);
                    me.setState ((prevState) =>{
                        for(let i = 0; i < response.data.content.length; i++){
                            response.data.content[i]["lastSaleTimeStamp"] = parseTime(response.data.content[i]["lastSaleTimeStamp"]);
                        }
                        prevState.pageData[page]=response.data.content;
                        return prevState;
                    });
                }
            }).catch(function (error) {
            console.log(error);
        });
    };

    onRowClick = record => {
        //const idSale = record.id;
        console.log("Clicked row: ",record);
        this.props.history.push({
            pathname: "ClientProfile",
            search: "?idClient=" + record.id
        })
    };

    render() {
        console.log("Props: ",this.props);
        return (
            <div>
                <PaginatedLazyTable
                    idCompany={this.props.idCompany}
                    columnDefs={this.state.columnDefs}
                    loadTablePage={this.loadClientTablePage}
                    length={this.props.clientCount}
                    onRowClick={this.onRowClick}
                    title={"Clientes"}
                    pageSize={Math.floor(this.state.windowHeight/50)}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { appUserReducer, companyReducer } = state;
    const { idCompany } = appUserReducer;
    const { clientCount } = companyReducer;
    console.log("Client count: ",clientCount);
    return {idCompany, clientCount};
};

export default withRouter(connect(mapStateToProps)(ClientTable));
