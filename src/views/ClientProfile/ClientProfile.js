import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Tabs, Descriptions } from "antd";
import "antd/dist/antd.css";
import "../../redux/reducers/appUserReducer"
import {getCookie, withParams, getUrlParams } from "../../utils";
import {connect} from "react-redux";
import * as constants from "../../constants";
import SaleTable from "../../components/SaleTable/SaleTable";

const { TabPane } = Tabs;

class ClientProfile extends Component {
    state = {
        client:null,
        tabIndex:0
    };

    componentDidMount() {
        this.loadClientData();
    }

    descriptionStyle = {
        background:"white",
        borderRadius:"10px",
        padding:"10px",
        width:"100%",
        marginTop:"5px"
    };

    loadClientData = () => {
        let idClient = getUrlParams("idClient");
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
    clientDescription = () => {
        return (
            <Descriptions title="Informacion personal: " layout="vertical" column={3} style={this.descriptionStyle}>
                <Descriptions.Item label="Nombre Factura">{this.state.client.billName}</Descriptions.Item>
                <Descriptions.Item label="NIT">{this.state.client.nit}</Descriptions.Item>
                <Descriptions.Item label="Nombre Completo">{this.state.client.fullName}</Descriptions.Item>
                <Descriptions.Item label="Celular">{this.state.client.cellphone}</Descriptions.Item>
                <Descriptions.Item label="Ubicacion">{this.state.client.location}</Descriptions.Item>
            </Descriptions>
        );
    };

    render() {
        return (
            <div>
                {this.state.client && this.clientDescription()}
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="Ventas" key="1">
                        {this.state.client && <SaleTable
                            idClient={this.state.client.id}
                            filterModel={"client"}
                            pageSize={10}
                        />}
                    </TabPane>
                    <TabPane tab="Credito" key="2">
                        Content of Tab Pane 2
                    </TabPane>
                </Tabs>
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

export default withRouter(connect(mapStateToProps)(ClientProfile));
