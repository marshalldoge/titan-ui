import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col } from "antd";
import { getCookie, withParams} from "../../utils.js";
import * as constants from "../../constants"
import {connect} from "react-redux";
import "antd/dist/antd.css";
import "./_Warehouse.scss";

const TButton = React.lazy(() => import("../../components/TButton/TButton"));
const WarehouseTable = React.lazy(() => import("../../components/WarehouseTable/WarehouseTable"));

class Warehouse extends Component {
    // TODO Add Date of last sale to table
    state={
        columns: [],
        data: [],
        columnDefs: [
            {headerName: "ID", field: "id", width: "10%"},
            {headerName: "Nombre", field: "name", width: "45%"},
            {headerName: "Ubicación", field: "location", width: "30%"},
            {headerName: "Color", field: "color", width: "15%"}
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
        const url = withParams(constants.BACKEND_URL + "/wms/Warehouse/findByIdCompanyPaginated", params);
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

    onRowClick = record => {
        //const idSale = record.id;
        console.log("Clicked row: ",record);
        this.props.history.push({
            pathname: "WarehouseProfile",
            search: "?idWarehouse=" + record.id
        })
    };

    goToClientForm = () => {
        this.props.history.push("/AppUserForm");
    };

    render() {
        console.log("Props: ",this.props);
        console.log("Number of rows in client table: ",Math.floor(this.state.windowHeight/100));
        return (
             <div>
                 <WarehouseTable/>
                 <Row type="flex" justify="end">
                     <Col span={6} style = {{textAlign:"end"}}>
                         <TButton
                            label={"Crear Almacén"}
                            size={"small"}
                            onClick={this.goToClientForm}
                            type={"inverse"}
                         />
                     </Col>
                 </Row>
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

export default withRouter(connect(mapStateToProps)(Warehouse));
