import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { } from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import "../../redux/reducers/appUserReducer"
import {getCookie, withParams, getUrlParams } from "../../utils";
import {connect} from "react-redux";
import * as constants from "../../constants";

class SupplierProfile extends Component {

    state = {
        Supplier:{}
    };

    componentDidMount() {
        this.setAppUserData();
    }

    setAppUserData = () => {
        let idSupplier = getUrlParams("idSupplier");
        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idSupplier: idSupplier
        };
        const url = withParams(constants.BACKEND_URL+"/Supplier/findById", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(data) {
                me.setState({ Supplier : data });
            });
    };

    render() {
        return (
            <div>
                <h1>Perfil of Supplier {getUrlParams("idSupplier")}</h1>
            </div>
        );
    };
}

const mapStateToProps = state => {
    const { appUserReducer } = state;
    const { idAppUser } = appUserReducer;
    console.log("idAPPuser for news: ",idAppUser);
    return {idAppUser};
};

export default withRouter(connect(mapStateToProps)(SupplierProfile));
