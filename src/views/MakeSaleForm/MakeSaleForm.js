import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {Input, Col, Row, Form, Typography, AutoComplete} from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import "../../redux/reducers/appUserReducer"
import {connect} from "react-redux";

const {Title} = Typography;

const ItemQuantityForm= React.lazy(() => import("../../components/ItemQuantityForm/ItemQuantityForm"));

class MakeSaleForm extends Component {

    state = {
        billName:"",
        nit:"",
        date:"",
        time:"",
        client:{}
    };

    handleSearch = value => {

    };
    onSelect = value => {
        console.log('onSelect', value);
        this.setState({nit:value});
        this.setState({client:this.props.nitClientHashMap[value]})
    };

    handleNitChange = value => {
        this.setState({nit:value});
        if(this.props.nitClientHashMap[value] !== undefined) {
            this.setState({client: this.props.nitClientHashMap[value]})
        }else{
            this.setState({client: {
                    billName:""
                }})
        }
    };

    handleBillChange = value => {
        this.setState({billName: value});
    };

    styleTitleRow = {
        background:"white",
        borderRadius:"5px",
        paddingLeft:"5px",
        height:"60px"
    };

    title = () => {
        return(
            <div>
                <Title level={2}>Venta</Title>
                <Title level={4}>{this.props.warehouseHashMap[this.props.idWarehouse]["name"]}</Title>
            </div>
        );
    };

    headers = () => {

    };

    saleData = () => {
        console.log("clientNit array: ",this.props.clientNit);
        console.log("nitClientHashMap: ",this.props.nitClientHashMap);
        return(
            <Row style={this.styleTitleRow}>
                <Col span={24}>
                    <Row>
                        <Form layout="inline">
                            <Form.Item label={"NIT"}>
                                <AutoComplete
                                    dataSource={this.props.clientNit}
                                    style={{ width: "200px" }}
                                    onSelect={this.onSelect}
                                    onSearch={this.handleSearch}
                                    placeholder="input here"
                                    filterOption = {true}
                                    onChange={this.handleNitChange}
                                />
                            </Form.Item>
                            <Form.Item label={"Nombre"}>
                                <Input
                                    type="text"
                                    value={this.state.client.billName}
                                    onChange={this.handleBillChange}
                                    style={{ width:"200px" }}
                                />
                            </Form.Item>
                        </Form>
                    </Row>
                    <Row>

                    </Row>
                </Col>
            </Row>
        );
    };

    render() {
        return (
            <div>
                {this.title()}
                {this.saleData()}
                <br/>
                <ItemQuantityForm
                    client={this.state.client}
                    nit={this.state.nit.trim()}
                    billName={this.state.billName.trim()}
                    idWarehouse={this.props.idWarehouse}/>
            </div>
        );
    };
}

const mapStateToProps = state => {
    const { appUserReducer,clientReducer, warehouseReducer } = state;
    const { idAppUser, idWarehouse } = appUserReducer;
    const { warehouseHashMap } = warehouseReducer;
    const { clientNit, nitClientHashMap } = clientReducer;
    console.log("clientNit for makesaleForm: ",clientNit);
    console.log("makesaleform title warehosue: ",idWarehouse);
    return {idAppUser, clientNit, nitClientHashMap, warehouseHashMap, idWarehouse};
};

export default withRouter(connect(mapStateToProps)(MakeSaleForm));
