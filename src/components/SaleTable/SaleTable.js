import React, { Component} from "react";
import { withRouter} from "react-router-dom";
import {Col, Table} from "antd";
import { getCookie, withParams} from "../../utils.js";
import * as constants from "../../constants"
import {connect} from "react-redux";
import moment from "moment";
import "antd/dist/antd.css";
import "../../redux/reducers/moduleReducer"
import "../../stylesheets/components/appUserTable/_appUserTable.scss";

const PaginatedLazyTable= React.lazy(() => import("../../components/PaginatedLazyTable/PaginatedLazyTable"));

class SaleTable extends Component {

    state= {
        columns: [],
        data: [],
        columnDefs: [
            {headerName: "ID", field: "id", width: "10%"},
            {headerName: "Hora", field: "time", width: "15%"},
            {headerName: "Cliente", field: "idClient", width: "30%"},
            {headerName: "Pagado", field: "paid", width: "15%"},
            {headerName: "Total", field: "total", width: "15%"},
            {headerName: "Moneda", field: "idCurrency", width: "15%"}
        ],
        loadPageFunction: null,
        length: null,
        windowHeight: document.body.clientHeight
    };

    componentDidMount() {
        this.setLoadPageFunction();
        this.setLength();
    }

    setLoadPageFunction = () => {
        console.log("SALE TABLE RENDERING: ",this.props.filterModel);
        switch(this.props.filterModel){
            case "appUser":
                this.setState({loadPageFunction:this.loadSaleTablePageByIdAppUser});
                break;
            case "company":
                this.setState({loadPageFunction:this.loadSaleTablePageByIdCompany});
                break;
            case "client":
                this.setState({loadPageFunction:this.loadSaleTablePageByIdClient});
                break;
            default:
                console.log("No model given for sale table");
                break;
        }
    };

    setLength = () => {

        console.log("SALE TABLE filtermodel:",this.props.filterModel);
        switch(this.props.filterModel){
            case "appUser":
                console.log("AppUser SaleCount: ",this.props.appUserSaleCount);
                this.setState({length:this.props.appUserSaleCount});
                break;
            case "company":
                this.setState({length:this.props.companySaleCount});
                break;
            case "client":
                this.setState({length:this.props.clientSaleCount});
                break;
            default:
                console.log("No model given for sale table");
                break;
        }
    };


    loadSaleTablePageByIdClient(page) {
        //console.log("sale tale props: ",this.props);
        //console.log("Loading page: ",page);
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idClient:this.props.idClient,
            page: page,
            pageSize: this.props.pageSize
        };
        let url = withParams(constants.BACKEND_URL + "/Sale/findByIdClientPaginated", params);
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

    loadSaleTablePageByIdCompany(page) {
        console.log("asdafsdfasdfasdf");
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idCompany: this.props.idCompany,
            page: page,
            pageSize: this.props.pageSize
        };
        let url = withParams(constants.BACKEND_URL + "/Sale/findByIdCompanyPaginated", params);
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
                        console.log("Sale by company: :",prevState);
                        return prevState;
                    });
                }
            }).catch(function (error) {
            console.log(error);
        });
    };

    loadSaleTablePageByIdAppUser(page) {
        //console.log("sale tale props: ",this.props);
        //console.log("Loading page: ",page);
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idAppUser: this.props.idAppUser,
            page: page,
            pageSize: this.props.pageSize
        };
        let url = withParams(constants.BACKEND_URL + "/Sale/findByIdAppUserPaginated", params);
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
        this.props.history.push({
            pathname: "SaleProfile",
            search: "?idSale=" + record.id
        })
    };

    SaleTable = () => {
        if(this.state.length != null && this.state.loadPageFunction){
            return(
                <PaginatedLazyTable
                    idCompany={this.props.idCompany}
                    idAppUser={this.props.idAppUser}
                    idClient={this.props.idClient}
                    idShift={this.props.idShift}
                    columnDefs={this.state.columnDefs}
                    loadTablePage={this.state.loadPageFunction}
                    length={this.state.length}
                    onRowClick={this.onRowClick}
                    title={"Ventas"}
                    pageSize={this.props.pageSize?this.props.pageSize:Math.floor(this.state.windowHeight/50)}
                />
            );
        }else{
            return null;
        }
    };

    render() {
        //console.log("Props: ",this.props);
        console.log("length : ",this.state.length);
        console.log("loadpagefunc: ",this.state.loadPageFunction);
        return (
            <div>
                {this.SaleTable()}
            </div>
        );
    };
}

const mapStateToProps = (state, ownProps) => {
    const { appUserReducer, moduleReducer, companyReducer, clientReducer } = state;
    const { idCompany } = appUserReducer;
    const { modules } = moduleReducer;
    let appUserSaleCount = appUserReducer.saleCount;
    let companySaleCount = companyReducer.saleCount;
    console.log("Clien hashmap: ",clientReducer.clientHashMap);
    console.log("ownprops: ",ownProps);
    let clientSaleCount = null;
    if(ownProps.idClient){
        clientSaleCount = clientReducer.clientHashMap[ownProps.idClient].saleCount;
    }
    console.log("AppUser reducer:", appUserReducer);
    return {idCompany,modules,appUserSaleCount,companySaleCount,clientSaleCount};
};

export default withRouter(connect(mapStateToProps)(SaleTable));
