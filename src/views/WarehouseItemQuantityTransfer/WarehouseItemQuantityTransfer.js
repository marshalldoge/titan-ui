import React, {Component } from "react";
import {withRouter } from "react-router-dom";
import {Row, Col, Input, Dropdown, Icon, Menu} from "antd";
import {getCookie} from "../../utils";
import {BACKEND_URL} from "../../constants";
import {connect} from "react-redux";
import "../../components/TButton/_TButton.scss";

const Search = Input.Search;

const Button = React.lazy(() => import("../../components/TButton/TButton"));
const ManualTable = React.lazy(() => import("../../components/ManualTable/ManualTable"));

class WarehouseItemQuantityTransfer extends Component{
    state={
        OriginWarehouse:"Origen",
        DestinationWarehouse:"Destino",
        data: [],
        columnDefs: [
            {headerName: "Código", field: "code", width: "10%"},
            {headerName: "Name", field: "name", width: "50%"},
            {headerName: "Cantidad", field: "quantity", width: "20%"},
            {headerName: "Measure", field: "Measure", width: "20%"}
        ]
    };

    componentDidMount() {

    }

    loadDestinationWarehouse=()=>{

    };

    WarehouseItems = (type) => {
        let warehouseDropDownItems = [];
        for(let warehouse in this.props.nameIdWarehouseHashMap){
            if(this.props.nameIdWarehouseHashMap.hasOwnProperty(warehouse)) {
                warehouseDropDownItems.push(
                     <Menu.Item key={this.props.nameIdWarehouseHashMap[warehouse]}>
                         {warehouse}
                     </Menu.Item>
                );
            }
        }
        return (
             <Menu onClick={type==="origin"?this.selectOriginWarehouse:this.selectDestinationWarehouse}>
                 {warehouseDropDownItems}
             </Menu>
        );
    };

    selectOriginWarehouse = (value) => {
        this.setState({OriginWarehouse:value.item.props.children});
    };

    selectDestinationWarehouse = (value) => {
        this.setState({DestinationWarehouse:value.item.props.children});
    };

    OriginDropDown = () => {
        return (
             <Dropdown overlay={this.WarehouseItems("origin")}>
                 {this.SimpleButton(this.state.OriginWarehouse)}
             </Dropdown>
        );
    };

    SimpleButton = (label) => {
       return (
             <div className={"buttonCtn big inverse"}>
                 <span className={"label big inverse"}>{label}</span>
             </div>
        );
    };

    DestinationDropDown = () => {
        return (
             <Dropdown overlay={this.WarehouseItems("destination")}>
                 {this.SimpleButton(this.state.DestinationWarehouse)}
             </Dropdown>
        );
    };

    ItemFinder = () => {
        return (
             <Search
                  placeholder="Código/Nombre"
                  onSearch={value => console.log(value)}
                  style={{ width: 200 }}
             />
        )
    };

    render() {
        return (
            <div>
                <h1>Transferencia de Items</h1>
                <Row type="flex" justify="space-between">
                    <Col span={11}>
                        <Row>
                            {this.OriginDropDown()}
                        </Row>
                        <br/>
                        <Row>
                            {this.ItemFinder()}
                        </Row>
                        <br/>
                        <Row>
                            {this.ItemFinder()}
                        </Row>
                        <br/>
                        <Row>
                            <ManualTable
                                 data={this.state.data}
                                 columnDefs={this.state.columnDefs}
                                 length={13}
                                 pageSize={13}
                            />
                        </Row>
                    </Col>
                    <Col span={2}>
                        <Icon type="double-right" />
                    </Col>
                    <Col span={11}>
                        <Row>
                            {this.DestinationDropDown()}
                        </Row>
                        <br/>
                        <Row>
                            <ManualTable
                                 data={this.state.data}
                                 columnDefs={this.state.columnDefs}
                                 length={13}
                                 pageSize={13}
                            />
                        </Row>

                    </Col>
                </Row>
                <br/>
                <Row>
                    <Button
                        label={"Mover productos"}
                        inverse={true}
                        size={"expanded"}
                    />
                </Row>

            </div>
        );
    }
}
const mapStateToProps = state => {
    const { appUserReducer, moduleReducer, itemQuantityReducer, warehouseReducer } = state;
    const { idCompany, idAppUser } = appUserReducer;
    const { modules } = moduleReducer;
    const { itemQuantityCode, itemQuantityHashMap } = itemQuantityReducer;
    const { nameIdWarehouseHashMap } = warehouseReducer;
    console.log("Itemquantity hashmap: ",itemQuantityHashMap);
    console.log("ITEMqUANTITY CODE: ",itemQuantityCode[1].length);
    const ItemCount = itemQuantityCode[1].length;
    return {idCompany,idAppUser, modules, itemQuantityHashMap, itemQuantityCode, ItemCount, nameIdWarehouseHashMap};
};
export default withRouter(connect(mapStateToProps)(WarehouseItemQuantityTransfer));
