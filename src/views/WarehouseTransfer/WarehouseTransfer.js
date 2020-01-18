import React, {Component } from "react";
import {withRouter } from "react-router-dom";
import {Row, Col, Input, Dropdown, Icon, Button, message, Menu} from "antd";
import {getCookie} from "../../utils";
import {BACKEND_URL} from "../../constants";

const Search = Input.Search;

const ConfigurableTable= React.lazy(() => import("../../components/WarehouseTransferTable/WarehouseTransferTable"));

class WarehouseTransfer extends Component{
    state={
        WarehousesAvailable: (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="1">
                    <Icon type="user" />
                    Mundial
                </Menu.Item>
                <Menu.Item key="2">
                    <Icon type="user" />
                    2nd menu item
                </Menu.Item>
                <Menu.Item key="3">
                    <Icon type="user" />
                    3rd item
                </Menu.Item>
            </Menu>
        ),
        OriginWarehouse:"",
        DestinationWarehouse:"",
        ItemsData:{},
        Columns:""
    };

    handleButtonClick=(e)=> {
        message.info('Click on left button.');
        console.log('click left button', e);
    };

    handleMenuClick=(e)=> {
        message.info('Click on menu item.');
        console.log('click', e);
    };
    componentDidMount() {
        this.loadItemFields();
        this.loadDestinationWarehouse();
    }

    loadItemFields = () => {
        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        const url = BACKEND_URL + "Item/Fields";
        fetch(url, {
            method: "GET",
            headers: headers
        })
            .then(response => response.text())
            .then(function (data) {
                console.log("Columns fields OF ITEMS CALL: ", data);
                let columnsName = data.split(',');
                let futureColumns = [];
                for (let i in columnsName) {
                    let name = columnsName[i];
                    let column = {};
                    switch (name) {
                        case "id":
                            column["title"] = "ID";
                            column["width"] = 50;
                            column["key"] = i;
                            column["dataIndex"] = name;

                            futureColumns.push(column);
                            break;
                        case "code":
                            column["title"] = "Codigo";
                            column["width"] = 50;
                            column["key"] = i;
                            column["dataIndex"] = name;

                            futureColumns.push(column);
                            break;
                        case "name":
                            column["title"] = "nombre";
                            column["width"] = 150;
                            column["key"] = i;
                            column["dataIndex"] = name;

                            futureColumns.push(column);
                            break;
                        default:
                            break;
                    }
                }
                me.setState({columns: futureColumns});
                console.log("COLUMNS AFTER ADDING ITEMS: ", me.state.columns);
            });
    }

    loadDestinationWarehouse=()=>{

    }

    render() {
        return (
            <div>
                <div><h1>Transferencia de Items</h1></div>
                <div>
                    <Row>
                        <Col span={12}>
                            <Dropdown overlay={this.state.WarehousesAvailable}>
                                <Button size="large">
                                    ORIGEN <Icon type="down" />
                                </Button>
                            </Dropdown>
                        </Col>
                        <Col span={12}>
                            <Dropdown overlay={this.state.WarehousesAvailable}>
                                <Button size="large">
                                    DESTINO <Icon type="down" />
                                </Button>
                            </Dropdown>
                        </Col>
                    </Row>
                    <Row>
                        <br></br>
                        <Search placeholder="Buscar item..." onSearch={value => console.log(value)} enterButton />
                    </Row>
                    <Row>
                        <Col span={24}>Tabla uno</Col>

                        <ConfigurableTable/>
                    </Row>
                    <Row>
                        <Col span={24}>Tabla dos</Col>
                    </Row>
                </div>
            </div>
        );
    }
}
export default withRouter(WarehouseTransfer);