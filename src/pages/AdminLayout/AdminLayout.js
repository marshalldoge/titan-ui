import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import {deleteCookie, getCookie, getJWtProperty, withParams} from "../../utils";
import {setIdAppUser,setAppUser,setModules,setClientData,setNitIdClientHashMap,
    setClientBillNameArray,setClientNitArray,setNitClientHashMap,setItemQuantityHashMap,
    setItemQuantityCode, setWarehouse, setShift, setCompany, setCurrency} from "../../redux/actions";
import moment from "moment";
import {connect} from "react-redux";
import * as constants from "../../constants";

const Sidebar = React.lazy(() => import("../../components/Sidebar/Sidebar"));
const Header = React.lazy(() => import("../../components/Header/Header"));
const Body = React.lazy(() => import("../../components/Body/Body"));

class AdminLayout extends Component {
    constructor(props) {
        //console.log("PROPS comming in ADMINLAYOUT: ",props);
        super(props);
        this.handleActiveSubmenu = this.handleActiveSubmenu.bind(this)
    }

    state = {
        collapsed: false,
        activeSubmenu: "NewsFeed",
        userData:{},
        successfulLoad:true
    };

    componentDidMount = () => {
        this.props.setIdAppUser(getJWtProperty("idAppUser"));
        this.loadAppUser();
        this.loadModules();
        this.loadNitIdClientHashMap();
        this.loadClientHashMap();
        this.loadItemQuantity();
        this.loadWarehouse();
        this.loadShift();
        this.loadCompany();
        this.loadCurrency();
    };

    loadNitIdClientHashMap = () => {
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idCompany:getJWtProperty("idCompany")
        };
        var url = withParams(constants.BACKEND_URL+"/pos/Client/nitIdClientHashMap", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(data) {
                //console.log("Result of ")
                me.props.setNitIdClientHashMap(data);
            }).catch(function(error) {
                me.logout();
                console.log(error);
        });
    };

    loadClientNitByIdCompany = () => {
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idCompany:getJWtProperty("idCompany")
        };
        var url = withParams(constants.BACKEND_URL+"/pos/Client/NitByIdCompany", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(data) {
                //console.log("Result of ")
                me.props.setNitIdClientHashMap(data);
            }).catch(function(error) {
                me.logout();
                console.log(error);
        });
    };

    loadClientHashMap = () => {
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idCompany:getJWtProperty("idCompany")
        };
        var url = withParams(constants.BACKEND_URL+"/pos/Client/ClientHashMapByIdCompany", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(data) {
                //console.log("Result of ")
                me.props.setClientData(data);
                let clientBillName = [];
                let clientNit= [];
                let nitClientHashMap = {};
                for (let client in data) {
                    if (data.hasOwnProperty(client)) {
                        //console.log(key + " -> " + p[key]);
                        clientBillName.push(data[client]["billName"]);
                        clientNit.push(data[client]["nit"]);
                        nitClientHashMap[data[client]["nit"]]=data[client];
                    }
                }
                console.log("clientNit made in request: ",clientNit);
                me.props.setClientNitArray(clientNit);
                me.props.setClientBillNameArray(clientBillName);
                me.props.setNitClientHashMap(nitClientHashMap);
            }).catch(function(error) {
            me.logout();
            console.log(error);
        });
    };

    loadAppUser(){
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idAppUser: getJWtProperty("idAppUser")
        };
        var url = withParams(constants.BACKEND_URL+"/auth/AppUser", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(data) {
                //console.log("Result of ")
                me.props.setAppUser(data);
            }).catch(function(error) {
            me.logout();
            console.log(error);
        });
    }
    loadModules(){
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idAppUser: getJWtProperty("idAppUser"),
            loc:false
        };
        var url = withParams(constants.BACKEND_URL+"/auth/AppUserModuleAction/reducer", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(data) {
                //console.log("Result of ")
                me.props.setModules(data);
            }).catch(function(error) {
            me.logout();
            console.log(error);
        });
    }
    loadItemQuantity(){
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idCompany: getJWtProperty("idCompany"),
        };
        var url = withParams(constants.BACKEND_URL+"/wms/WarehouseItemQuantity/itemQuantityHashMap", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(data) {
                //console.log("Result of ")
                me.props.setItemQuantityHashMap(data);
                let itemQuantityCode = {};
                for (let warehouse in data) {
                    if (data.hasOwnProperty(warehouse)) {
                        //console.log(key + " -> " + p[key]);
                        itemQuantityCode[warehouse]=[];
                        for (let item in data[warehouse]) {
                            if (data[warehouse].hasOwnProperty(item)) {
                                //console.log(key + " -> " + p[key]);
                                itemQuantityCode[warehouse].push(item);
                            }
                        }
                    }
                }
                console.log("Item codes: ",itemQuantityCode);
                me.props.setItemQuantityCode(itemQuantityCode);
            }).catch(function(error) {
            me.logout();
            console.log(error);
        });
    }
    loadWarehouse = () => {
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idCompany: getJWtProperty("idCompany"),
        };
        var url = withParams(constants.BACKEND_URL+"/wms/Warehouse/warehouseHashMap", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(data) {
                //console.log("Result of ")
                me.props.setWarehouse(data);
            }).catch(function(error) {
            me.logout();
            console.log(error);
        });
    };

    loadShift = () => {
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idAppUser: getJWtProperty("idAppUser")
        };
        var url = withParams(constants.BACKEND_URL+"/pos/Shift/currentShift", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(data) {
                //console.log("Result of ")
                if(data.success){
                    data.data.open = moment(data.data.open,"YYYY-MM-DD[T]HH:mm:ss");
                    console.log("data.data: ",data.data);
                    me.props.setShift(data.data);
                }
            }).catch(function(error) {
            me.logout();
            console.log(error);
        });
    };

    loadCompany = () => {
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idCompany: getJWtProperty("idCompany"),
        };
        var url = withParams(constants.BACKEND_URL+"/pos/Company/findById", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(response) {
                if(response.success){
                    me.props.setCompany(response.data);
                }
            }).catch(function(error) {
            me.logout();
            console.log(error);
        });
    };

    loadCurrency(){
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idAppUser: getJWtProperty("idAppUser")
        };
        var url = withParams(constants.BACKEND_URL+"/pos/Currency/reducer", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
             .then(function(response) {
                 if(response.success){
                     me.props.setCurrency(response.data);
                 }
             }).catch(function(error) {
            me.logout();
            console.log(error);
        });
    }

    handleActiveSubmenu=(newActiveSubmenu)=>{
        this.setState({activeSubmenu:newActiveSubmenu});
        console.log("GOING TO SUBMENU; ",newActiveSubmenu.replace( /\s/g, ''));
        this.props.history.push(newActiveSubmenu.replace( /\s/g, '') );
    };

    onCollapse = collapsed => {
        //console.log(collapsed);
        this.setState({ collapsed });
    };

    logout = () => {
        deleteCookie("JWT");
        this.props.history.push("/login");
    };

    render() {
        return (
            <Layout style={{ minHeight: "100vh"}}>
                <Sidebar  handleActiveSubmenu={this.handleActiveSubmenu}/>
                <Layout style={{ overflow:"hidden" }}>
                    <Header style={{height: "100%"}}/>
                    <Body
                        style={{height: "100%"}}
                        activeSubmenu={this.state.activeSubmenu}
                    />
                </Layout>
            </Layout>
        );
    }
}

export default withRouter(connect(null,{setIdAppUser,setAppUser,setModules,setClientData,
    setNitIdClientHashMap,setClientBillNameArray,setClientNitArray,setNitClientHashMap,
    setItemQuantityHashMap,setItemQuantityCode, setWarehouse, setShift, setCompany, setCurrency})(AdminLayout));
