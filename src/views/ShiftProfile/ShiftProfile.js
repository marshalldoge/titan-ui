import React, { Component, Suspense } from "react";
import { withRouter, Switch, Redirect, Route} from "react-router-dom";
import { Layout, Menu, Descriptions, Table } from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import moment from "moment";
import "../../redux/reducers/appUserReducer"
import {getCookie, getJWtProperty, withParams, getUrlParams } from "../../utils";
import {connect} from "react-redux";
import * as constants from "../../constants";

const { SubMenu } = Menu;
const { Content, Sider, Footer } = Layout;

class ShiftProfile extends Component {
    constructor(props) {
        super(props);
    };

    state = {
        sale:{},
        client:{},
        columns:[],
        itemQuantitiesData:[]
    };

    componentDidMount() {
        this.loadSaleData();
        this.loadFields();
        this.loadItemQuantitiesData();
    }

    loadFields = () =>{
        this.setState({columns:[
                {
                    title:"Codigo",
                    width:"20%",
                    key:"0",
                    dataIndex:"hashcode",
                    className:"table-column codigo"
                },
                {
                    title:"Descripción",
                    width:"35%",
                    key:"0",
                    dataIndex:"name",
                    className:"table-column codigo"
                },
                {
                    title:"Cantidad",
                    width:"15%",
                    key:"0",
                    dataIndex:"quantity",
                    className:"table-column codigo"
                },
                {
                    title:"PV",
                    width:"15%",
                    key:"0",
                    dataIndex:"salePrice",
                    className:"table-column codigo"
                },
                {
                    title:"Total",
                    width:"15%",
                    key:"0",
                    dataIndex:"total",
                    className:"table-column codigo"
                },
            ]});
    };

    loadSaleData = () => {
        let idSale = getUrlParams("idSale");
        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idSale: idSale
        };
        const url = withParams(constants.BACKEND_URL+"/Sale/findById", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(response) {
                me.setState({ sale : response.data },() => me.loadClientData(response.data.idClient) );
            });
    };

    loadClientData = idClient => {
        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idClient: idClient
        };
        const url = withParams(constants.BACKEND_URL+"/Client/findById", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(response) {
                me.setState({ client : response.data });
            });
    };

    loadItemQuantitiesData = () => {
        let idSale = getUrlParams("idSale");
        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idSale: idSale
        };
        const url = withParams(constants.BACKEND_URL+"/SaleItemQuantity/findAllByIdSale", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(response) {

                me.setState({ itemQuantitiesData : response.data });
            });
    };

    descriptionStyle = {
        background:"white",
        borderRadius:"10px",
        padding:"10px",
        width:"100%",
        marginTop:"5px"
    };

    saleInformation = () => {
        return (
            <Descriptions title="Informacion de la venta:" layout="vertical" column={2} style={this.descriptionStyle}>
                <Descriptions.Item label="Nombre Factura">{this.state.client.billName}</Descriptions.Item>
                <Descriptions.Item label="NIT">{this.state.client.nit}</Descriptions.Item>
                <Descriptions.Item label="Fecha">
                    {moment(this.state.sale.time,"YYYY-MM-DD[T]HH:mm:ss").format("YYYY-MM-DD")}
                </Descriptions.Item>
                <Descriptions.Item label="Hora">
                    {moment(this.state.sale.time,"YYYY-MM-DD[T]HH:mm:ss").format("HH:mm:ss")}
                </Descriptions.Item>
            </Descriptions>
        );
    };

    saleItemQuantities = () => {

    };

    tableStyle = {
        marginTop: "5px"
    };

    ItemQuantitiesTable = () => {
        return (
            <Table style={this.tableStyle} columns={this.state.columns} dataSource={this.state.itemQuantitiesData}/>
        );
    };

    render() {
        return (
            <div>
                {this.saleInformation()}
                {this.ItemQuantitiesTable()}
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

export default withRouter(connect(mapStateToProps)(ShiftProfile));
