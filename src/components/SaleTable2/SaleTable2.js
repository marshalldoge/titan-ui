import React, { Component} from "react";
import { withRouter} from "react-router-dom";
import { Typography } from "antd";
import { getCookie, withParams} from "../../utils.js";
import * as constants from "../../constants"
import {connect} from "react-redux";
import moment from "moment";
import "antd/dist/antd.css";
import "../../redux/reducers/moduleReducer"
import "../../stylesheets/components/appUserTable/_appUserTable.scss";

const {Title} = Typography;

class SaleTable2 extends Component {

    state = {
        columnDefs: [
            {headerName: "Hora", field: "make", width: 100},
            {headerName: "Cliente", field: "model", width: 150},
            {headerName: "Pagado", field: "price", width: 100},
            {headerName: "Total", field: "make", width: 100},
            {headerName: "Moneda", field: "model", width: 100}

        ],
        rowData: [
            {make: "Toyota", model: "Celica", price: 35000},
            {make: "Ford", model: "Mondeo", price: 32000},
            {make: "Porsche", model: "Boxter", price: 72000}
        ]
    };

    tableStyle = {
        height: "200px",
        width: "600px",
        margin: "auto"
    };
    render = () => {
        return (
            <div
                className="ag-theme-balham"
                style={this.tableStyle}
            >
                <Title level={4}>Ventas de hoy</Title>
            </div>
        );
    };

}

const mapStateToProps = (state,ownProps) => {
    const { appUserReducer, moduleReducer } = state;
    const { idCompany} = appUserReducer;
    const { modules } = moduleReducer;
    //console.log("OWN PROPS OF MAKESTATE TO PROPS: ",ownProps);
    const { idAppUser } = ownProps;
    //console.log("idCompany for tableUser: ",idCompany);
    return {idCompany,modules,idAppUser};
};

export default withRouter(connect(mapStateToProps)(SaleTable2));
