import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Descriptions, Table } from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import moment from "moment";
import "../../redux/reducers/appUserReducer"
import {getCookie, withParams, getUrlParams } from "../../utils";
import {connect} from "react-redux";
import * as constants from "../../constants";

const PaginatedLazyTable= React.lazy(() => import("../../components/PaginatedLazyTable/PaginatedLazyTable"));

class SaleProfile extends Component {

    state = {
        sale:null,
        client:{},
        columns:[],
        columnDefs: [
            {headerName: "ID", field: "id", width: "10%"},
            {headerName: "Codigo", field: "hashcode", width: "20%"},
            {headerName: "Descripcion", field: "name", width: "30%"},
            {headerName: "Cantidad", field: "quantity", width: "15%"},
            {headerName: "PV", field: "salePrice", width: "10%"},
            {headerName: "TOTAL", field: "total", width: "15%"}
        ],
    };

    componentDidMount() {
        this.loadSaleData();
    }

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
        const url = withParams(constants.BACKEND_URL+"/pos/Sale/findById", params);
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
        const url = withParams(constants.BACKEND_URL+"/pos/Client/findById", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(response) {
                me.setState({ client : response.data });
            });
    };

    loadSaleItemQuantityTablePageByIdSale(page) {
        //console.log("sale tale props: ",this.props);
        //console.log("Loading page: ",page);
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idSale: this.props.idSale,
            page: page,
            pageSize: this.props.pageSize
        };
        let url = withParams(constants.BACKEND_URL + "/pos/SaleItemQuantity/findByIdSalePaginated", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function (response) {
                //console.log("me in getpage fetch is ",me);
                if(response.success){
                    //console.log("Page data received: ",response);
                    me.setState ((prevState) =>{
                        for(let i=0;i<response.data.content.length;i++){
                            response.data.content[i].time =
                                moment(response.data.content[i].time,"YYYY-MM-DD[T]HH:mm:ss").format("HH:mm:ss");
                        }
                        prevState.pageData[page]=response.data.content;
                        console.log("New state:",prevState);
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
        //TODO add an Item Profile taht you can enter by this table
    };


    descriptionStyle = {
        background:"white",
        borderRadius:"10px",
        padding:"10px",
        width:"100%",
        marginTop:"5px"
    };

    saleInformation = () => {
        if(this.state.sale) {
            return (
                <Descriptions title="Informacion de la venta:" layout="vertical" column={2}
                              style={this.descriptionStyle}>
                    <Descriptions.Item label="Nombre Factura">{this.state.client.billName}</Descriptions.Item>
                    <Descriptions.Item label="NIT">{this.state.client.nit}</Descriptions.Item>
                    <Descriptions.Item label="Fecha">
                        {moment(this.state.sale.time, "YYYY-MM-DD[T]HH:mm:ss").format("YYYY-MM-DD")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Hora">
                        {moment(this.state.sale.time, "YYYY-MM-DD[T]HH:mm:ss").format("HH:mm:ss")}
                    </Descriptions.Item>
                </Descriptions>
            );
        }else{
            return null;
        }
    };

    tableStyle = {
        marginTop: "5px"
    };

    ItemQuantitiesTable = () => {
        if(this.state.sale) {
            return (
                <PaginatedLazyTable
                    idSale={this.state.sale.id}
                    columnDefs={this.state.columnDefs}
                    loadTablePage={this.loadSaleItemQuantityTablePageByIdSale}
                    length={this.state.sale.itemCount}
                    onRowClick={this.onRowClick}
                    title={"Productos de la venta:"}
                    pageSize={10}
                />
            );
        }else{
            return null;
        }
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

export default withRouter(connect(mapStateToProps)(SaleProfile));
