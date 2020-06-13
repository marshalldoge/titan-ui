import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import {deleteCookie, getCookie, getJWtProperty, withParams} from "../../utils";
import {setIdAppUser,setAppUser,setModules,setClientData,setNitIdClientHashMap,
    setClientBillNameArray,setClientNitArray,setNitClientHashMap,setItemQuantityHashMap,
    setItemQuantityCode, setWarehouse, setShift, setCompany, setCurrency, setMeasure} from "../../redux/actions";
import moment from "moment";
import {connect} from "react-redux";
import * as constants from "../../constants";
import LoadingGif from'../../assets/gif/loading.gif';

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
        successfulLoad:true,
        servicesToLoad: 10,
        loadedServices: 0
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
        this.loadMeasure();
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
        var url = withParams(constants.BACKEND_URL+"/Client/nitIdClientHashMap", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(data) {
                //console.log("Result of ")
                me.props.setNitIdClientHashMap(data);
                me.setState ((prevState) =>{
                    prevState.loadedServices = prevState.loadedServices+1;
                    console.log(":V9");
                    return prevState;
                });
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
        var url = withParams(constants.BACKEND_URL+"/Client/NitByIdCompany", params);
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
        var url = withParams(constants.BACKEND_URL+"/Client/ClientHashMapByIdCompany", params);
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
                me.setState ((prevState) =>{
                    prevState.loadedServices = prevState.loadedServices+1;
                    console.log(":V8");
                    return prevState;
                });
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
        var url = withParams(constants.BACKEND_URL+"/AppUser", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(data) {
                //console.log("Result of ")
                me.props.setAppUser(data);
                me.setState ((prevState) =>{
                    prevState.loadedServices = prevState.loadedServices+1;
                    console.log(":V7");
                    return prevState;
                });
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
        var url = withParams(constants.BACKEND_URL+"/AppUserModuleAction/reducer", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(data) {
                //console.log("Result of ")
                me.props.setModules(data);
                me.setState ((prevState) =>{
                    prevState.loadedServices = prevState.loadedServices+1;
                    console.log(":V6");
                    return prevState;
                });
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
        var url = withParams(constants.BACKEND_URL+"/WarehouseItemQuantity/itemQuantityHashMap", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(data) {
                //console.log("Result of ")
                me.props.setItemQuantityHashMap(data);
                console.log("ItemQuanitity data: ",data);
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
                me.setState ((prevState) =>{
                    prevState.loadedServices = prevState.loadedServices+1;
                    console.log(":V5");
                    return prevState;
                });
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
        var url = withParams(constants.BACKEND_URL+"/Warehouse/warehouseHashMap", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(data) {
                //console.log("Result of ")
                me.props.setWarehouse(data);
                me.setState ((prevState) =>{
                    prevState.loadedServices = prevState.loadedServices+1;
                    console.log(":V4");
                    return prevState;
                });
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
        var url = withParams(constants.BACKEND_URL+"/Shift/currentShift", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(data) {
                console.log("Result of SHIFT: ",data);
                if(data.success){
                    data.data.open = moment(data.data.open,"YYYY-MM-DD[T]HH:mm:ss");
                    console.log("data.data: ",data.data);
                    me.props.setShift(data.data);
                }
                me.setState ((prevState) =>{
                    prevState.loadedServices = prevState.loadedServices+1;
                    console.log(":V3");
                    return prevState;
                });
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
        var url = withParams(constants.BACKEND_URL+"/Company/findById", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(response) {
                console.log("V2?",response);
                if(response.success){
                    me.props.setCompany(response.data);
                    me.setState ((prevState) =>{
                        prevState.loadedServices = prevState.loadedServices+1;
                        console.log(":V2");
                        return prevState;
                    });
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
        var url = withParams(constants.BACKEND_URL+"/Currency/reducer", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
             .then(function(response) {
                 if(response.success){
                     me.props.setCurrency(response.data);
                     me.setState ((prevState) =>{
                         prevState.loadedServices = prevState.loadedServices+1;
                         console.log(":V");
                         return prevState;
                     });
                 }
             }).catch(function(error) {
            me.logout();
            console.log(error);
        });
    }
    loadMeasure = () => {
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idCompany: getJWtProperty("idCompany"),
        };
        var url = withParams(constants.BACKEND_URL+"/Measure/measureHashMap", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
             .then(function(response) {
                 //console.log("Result of ")
                 if(response.success){
                     me.props.setMeasure(response.data);
                     me.setState ((prevState) =>{
                         prevState.loadedServices = prevState.loadedServices+1;
                         console.log(":V10");
                         return prevState;
                     });
                 }else{

                 }
             }).catch(function(error) {
            me.logout();
            console.log(error);
        });
    };

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

    Loading = () => {
        return (
             <div style={{width:"100%",height:"100%",verticalAlign:"middle",textAlign:"center"}}>
                <img src={LoadingGif} alt={"Cargando..."}/>
             </div>
        );
    };

    Body = () => {
        return (
             <Body
                  style={{height: "100%"}}
                  activeSubmenu={this.state.activeSubmenu}
             />
        );
    };

    render() {
        //console.log("LOADING: ",this.state.loadedServices);
        return (
            <Layout style={{ minHeight: "100vh"}}>
                <Sidebar  handleActiveSubmenu={this.handleActiveSubmenu}/>
                <Layout style={{ overflow:"hidden" }}>
                    <Header style={{height: "100%"}}/>
                    {
                        this.state.loadedServices === this.state.servicesToLoad?
                        this.Body():this.Loading()
                    }
                </Layout>
            </Layout>
        );
    }
}

export default withRouter(connect(null,{setIdAppUser,setAppUser,setModules,setClientData,
    setNitIdClientHashMap,setClientBillNameArray,setClientNitArray,setNitClientHashMap,
    setItemQuantityHashMap,setItemQuantityCode, setWarehouse, setShift, setCompany, setCurrency, setMeasure})(AdminLayout));
