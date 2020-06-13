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

class PurchaseTable extends Component {

    state= {
        columns: [],
        data: [],
        columnDefs: [
            {headerName: "ID", field: "id", width: "10%"},
            {headerName: "Hora", field: "time", width: "15%"},
            {headerName: "Proveedor", field: "idSupplier", width: "30%"},
            {headerName: "Pagado", field: "paid", width: "15%"},
            {headerName: "Total", field: "total", width: "15%"},
            {headerName: "Moneda", field: "idCurrency", width: "15%"}
        ],
        loadPageFunction: null,
        length: 5,
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
                this.setState({loadPageFunction:this.loadPurchaseTablePageByIdAppUser});
                break;
            case "company":
                this.setState({loadPageFunction:this.loadPurchaseTablePageByIdCompany});
                break;
            case "client":
                this.setState({loadPageFunction:this.loadPurchaseTablePageByIdClient});
                break;
            default:
                console.log("No model given for purchase table");
                break;
        }
    };

    setLength = () => {
        switch(this.props.filterModel){
            case "appUser":
                this.setState({length:this.props.appUserPurchaseCount});
                break;
            case "company":
                //this.setState({length:this.props.companyPurchaseCount});
                break;
            case "client":
                this.setState({length:this.props.clientPurchaseCount});
                break;
            default:
                console.log("No model given for purchase table");
                break;
        }
    };


    loadPurchaseTablePageByIdClient(page) {
        //console.log("purchase tale props: ",this.props);
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
        let url = withParams(constants.BACKEND_URL + "/Purchase/findByIdClientPaginated", params);
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

    loadPurchaseTablePageByIdCompany(page) {
        //console.log("purchase tale props: ",this.props);
        //console.log("Loading page: ",page);
        console.log("Loading company purchases: ");
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
        let url = withParams(constants.BACKEND_URL + "/Purchase/findByIdCompanyPaginated", params);
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

    loadPurchaseTablePageByIdAppUser(page) {
        //console.log("purchase tale props: ",this.props);
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
        let url = withParams(constants.BACKEND_URL + "/Purchase/findByIdAppUserPaginated", params);
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
        //const idPurchase = record.id;
        console.log("Clicked row: ",record);
        this.props.history.push({
            pathname: "PurchaseProfile",
            search: "?idPurchase=" + record.id
        })
    };

    PurchaseTable = () => {
        console.log("About to render lazy table:");
        if(this.state.length && this.state.loadPageFunction){
            return(
                <PaginatedLazyTable
                    idCompany={this.props.idCompany}
                    idAppUser={this.props.idAppUser}
                    idClient={this.props.idClient}
                    idShift={this.props.idShift}
                    columnDefs={this.state.columnDefs}
                    loadTablePage={this.state.loadPageFunction}
                    length={10}
                    onRowClick={this.onRowClick}
                    title={"Compras"}
                    pageSize={Math.floor(this.state.windowHeight/50)}
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
                {this.PurchaseTable()}
            </div>
        );
    };
}

const mapStateToProps = (state, ownProps) => {
    const { appUserReducer, moduleReducer, companyReducer, clientReducer } = state;
    const { idCompany } = appUserReducer;
    const { modules } = moduleReducer;
    let appUserPurchaseCount = ownProps.purchaseCount;
    let companyPurchaseCount = companyReducer.purchaseCount;
    console.log("Clien hashmap: ",clientReducer.clientHashMap);
    console.log("ownprops: ",ownProps);
    /*let clientPurchaseCount = null;
    if(ownProps.idClient){
        clientPurchaseCount = clientReducer.clientHashMap[ownProps.idClient].purchaseCount;
    }

     */
    console.log("AppUser reducer:", appUserReducer);
    return {idCompany,modules,appUserPurchaseCount,companyPurchaseCount};
};

export default withRouter(connect(mapStateToProps)(PurchaseTable));
