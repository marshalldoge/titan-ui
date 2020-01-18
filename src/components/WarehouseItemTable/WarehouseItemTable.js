import React, { Component, Suspense } from "react";
import { withRouter, Switch, Redirect, Route} from "react-router-dom";
import { Table } from "antd";
import { getCookie, withParams} from "../../utils.js";
import * as constants from "../../constants"
import {connect} from "react-redux";
//import {Sidebar} from "../../components/Sidebar.js";
import "antd/dist/antd.css";
import "../../stylesheets/components/appUserTable/_appUserTable.scss";

class WarehouseItemTable extends Component {
    constructor(props) {
        super(props);
        this.goToAppUserProfile = this.goToAppUserProfile.bind(this)
    }

    state={
        columns: [],
        data: []
    }

    componentDidMount() {
        this.loadFields();
        this.loadData();
    }

    loadFields=()=>{
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        var url = constants.BACKEND_URL+"/WarehouseItem/Fields";
        fetch(url, {
            method: "GET",
            headers: headers
        })
            .then(response => response.text())
            .then(function(data) {
                console.log("Columns fields: ",data);
                let columnsName=data.split(',');
                let futureColumns=[];
                for(let i in columnsName){
                    let name=columnsName[i];
                    let column={};
                    switch(name){
                        case "id":
                            column["title"]="ID";
                            column["width"]='5%';
                            column["key"]=i;
                            column["dataIndex"]=name;
                            column["className"]="table-column "+name;
                            futureColumns.push(column);
                            break;
                        case "fullName":
                            column["title"]="Nombre";
                            column["width"]='40%';
                            column["key"]=i;
                            column["dataIndex"]=name;
                            column["className"]="table-column "+name;

                            futureColumns.push(column);
                            break;
                        case "username":
                            column["title"]="Nick";
                            column["width"]='10%';
                            column["key"]=i;
                            column["dataIndex"]=name;
                            column["className"]="table-column "+name;
                            futureColumns.push(column);
                            break;
                        /*case "password":
                            column["title"]="Contraseña";
                            column["width"]="10%";
                            column["key"]=i;
                            column["dataIndex"]=name;
                            column["className"]="table-column "+name;
                            futureColumns.push(column);
                            break;

                         */
                        case "role":
                            column["title"]="Rol";
                            column["width"]='10%';
                            column["key"]=i;
                            column["dataIndex"]=name;
                            column["className"]="table-column "+name;
                            futureColumns.push(column);
                            break;
                        case "location":
                            column["title"]="Ubicacion";
                            column["width"]='20%';
                            column["key"]=i;
                            column["dataIndex"]=name;
                            column["className"]="table-column "+name;
                            futureColumns.push(column);
                            break;
                    }
                }
                console.log(futureColumns);
                me.setState({columns:futureColumns});
                console.log("Future columns for user table: ",futureColumns);
            });
    }
    loadData=()=>{
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idCompany:this.props.idCompany
        };
        var url = withParams(constants.BACKEND_URL+"/WarehouseItem/findAllByIdCompany",params);
        fetch(url, {
            method: "GET",
            headers: headers
        })
            .then(response => response.json())
            .then(function(data) {
                console.log("Columns fields: ",data);
                console.log("Use data: ",data);
                let futureData=[];
                for(let i in data){
                    data[i]["key"]=data[i]["id"];
                    //data[i]["password"]="1";
                }
                me.setState({data:data});

                //console.log(futureColumns);
                //me.setState({columns:futureColumns});
            });
    };

    goToAppUserProfile = idAppUser =>{
        console.log("THIS APPUSER PROFILE: ",this);
        //this.setState({activeSubmenu:newActiveSubmenu});
        console.log("GOING TO SUBMENU; ",idAppUser);
        //this.props.history.push(idAppUser.replace( /\s/g, '') );
        this.props.history.push({
            pathname: "AppUserProfile",
            search: "?idAppUser=" + idAppUser
        })
    };

    render() {
        console.log("Props: ",this.props);
        return (
            <div>
                <Table
                    columns={this.state.columns}
                    dataSource={this.state.data}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                console.log("CLiced data: ",record," and :: ",rowIndex);
                                const idAppUser = record.id;
                                this.goToAppUserProfile(idAppUser);
                            }, // click row
                        };
                    }}></Table>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { appUserReducer } = state;
    const { idCompany } = appUserReducer;
    console.log("idCompany for tableUser: ",idCompany);
    return {idCompany};
};

export default withRouter(connect(mapStateToProps)(WarehouseItemTable));
