import React, { Component } from "react";
import { withRouter} from "react-router-dom";
import { getCookie, withParams} from "../../utils.js";
import * as constants from "../../constants"
import {connect} from "react-redux";
import "antd/dist/antd.css";
import "../../stylesheets/components/appUserTable/_appUserTable.scss";
import moment from 'moment';

const PaginatedLazyTable= React.lazy(() => import("../../components/PaginatedLazyTable/PaginatedLazyTable"));

class SupplierTable extends Component {
    constructor(props) {
        super(props);
    }

    state={
        columnDefs: [
            {headerName: "ID", field: "id", width: "10%"},
            {headerName: "Nombre", field: "fullName", width: "60%"},
            {headerName: "Celular", field: "cellphone", width: "30%"},
        ],
        loadPageFunction: null,
        length: null,
        windowHeight: document.body.clientHeight
    };

    componentDidMount() {
    }

    loadSupplierTablePage(page){
        console.log("SUPPLIER Loading page: ",page);
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idCompany: this.props.idCompany,
            page: page,
            pageSize: 12
        };
        var url = withParams(constants.BACKEND_URL+"/pos/Supplier/findAllByIdCompanyPaginated",params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
             .then(function(response) {
                if(response.success) {
                    me.setState((prevState) => {
                        console.log("SUPPLIER prevstate looks like: ",prevState);
                        prevState.pageData[page] = response.data.content;
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
            pathname: "SupplierProfile",
            search: "?idSupplier=" + record.id
        })
    };

    render() {
        console.log("Props: ",this.props);
        return (
             <div style={{textAlign:"center"}}>
                 <PaginatedLazyTable
                      idCompany={this.props.idCompany}
                      columnDefs={this.state.columnDefs}
                      loadTablePage={this.loadSupplierTablePage}
                      length={this.props.shiftCount}
                      onRowClick={this.onRowClick}
                      pageSize={12}
                      title={"Proveedores"}
                 />
             </div>
        );
    }
}

const mapStateToProps = state => {
    const { appUserReducer, companyReducer } = state;
    const { idCompany } = appUserReducer;
    const { supplierCount } = companyReducer;
    console.log("idCompany for tableUser: ",idCompany);
    return {idCompany, supplierCount};
};

export default withRouter(connect(mapStateToProps)(SupplierTable));
