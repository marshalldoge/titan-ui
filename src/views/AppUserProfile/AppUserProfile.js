import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {Col, Row, Tabs} from "antd";
import "antd/dist/antd.css";
import "../../redux/reducers/appUserReducer"
import {getCookie, withParams, getUrlParams } from "../../utils";
import {connect} from "react-redux";
import SaleTable from "../../components/SaleTable/SaleTable";
import ModuleForm from "../../components/ModuleForm/ModuleForm";
import ShiftTable from "../../components/ShiftTable/ShiftTable";
import {BACKEND_URL} from "../../constants";

const Description= React.lazy(() => import("../../components/Description/Description"));
const { TabPane } = Tabs;

class AppUserProfile extends Component {

    state = {
        AppUser:{
            id:null
        }
    };

    componentDidMount() {
        this.setAppUserData();
    }

    setAppUserData = () => {
        let idAppUser = getUrlParams("idAppUser");
        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idAppUser: idAppUser
        };
        const url = withParams(BACKEND_URL+"/AppUser", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(data) {
                me.setState({ AppUser : data });
            });
    };

    onEditClick = record => {
        console.log("Clicked row: ",record);
        this.props.history.push({
            pathname: "EditAppUser",
            search: "?idAppUser=" + record.id
        })
    };


    ModuleConfigurationTab = () => {
        if(true){
            return(
                <TabPane tab="Permisos" key="4">
                    <ModuleForm idAppUser={this.state.AppUser.id}/>
                </TabPane>
            );
        }
    };

    callback = key => {
        console.log(key);
    };


    render() {
        return (
            <div>
                <Row>
                    <Description
                        person = {this.state.AppUser}
                        onEditClick = {this.onEditClick}
                    />
                </Row>
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="Ventas" key="1">
                        {this.state.AppUser.id && <SaleTable
                            idAppUser={
                                (()=>{
                                    console.log("Giving to sales table: ",this.state.AppUser.id);
                                    return this.state.AppUser.id;
                                })()}
                            filterModel={"appUser"}
                            pageSize={12}
                            saleCount={this.state.AppUser.saleCount}
                        />}
                    </TabPane>
                    <TabPane tab="Cajas" key="3">
                        <ShiftTable
                            idAppUser = {this.state.AppUser.id}
                        />
                    </TabPane>
                    {this.ModuleConfigurationTab()}
                </Tabs>
            </div>
        );
    };
}

const mapStateToProps = state => {
    const { appUserReducer } = state;
    const { idAppUser } = appUserReducer;
    //console.log("idAPPuser for news: ",idAppUser);
    return {idAppUser};
};

export default withRouter(connect(mapStateToProps)(AppUserProfile));
