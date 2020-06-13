import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {Menu, Icon, Button, Dropdown, Card, Typography, Row, Col} from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import "../../redux/reducers/appUserReducer"
import {connect} from "react-redux";
import { setIdWarehouse } from "../../redux/actions";
import moment from "moment";
import SaleTable from "../../components/SaleTable/SaleTable";
import {getCookie, getJWtProperty, withParams} from "../../utils";
import * as constants from "../../constants";
import shiftReducer from "../../redux/reducers/shiftReducer";

const { Title } = Typography;

const SaleTable2= React.lazy(() => import("../../components/SaleTable2/SaleTable2"));
const PaginatedLazyTable= React.lazy(() => import("../../components/PaginatedLazyTable/PaginatedLazyTable"));

class MakeSale extends Component {

    state = {
        warehouse:"",
        columnDefs: [
            {headerName: "Hora", field: "time", width: 100},
            {headerName: "Cliente", field: "idClient", width: 150},
            {headerName: "Pagado", field: "paid", width: 100},
            {headerName: "Total", field: "total", width: 100},
            {headerName: "Moneda", field: "idCurrency", width: 100}
        ]
    };

    componentDidMount() {
        this.setState({warehouse:this.props.nameWarehouse[0]});
    }

    loadSaleTablePage(page) {
        console.log("Loading page: ",page);
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idShift: this.props.idShift,
            idAppUser: this.props.idAppUser,
            page: page
        };
        var url = withParams(constants.BACKEND_URL + "/Sale/findSaleByIdAppUserAndIdShiftPaginated", params);
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


    goToMakeSaleForm = () => {
        this.props.history.push("/MakeSaleForm");
    };

    SaleTitle = () => {
        return(
          <Title onClick={this.goToMakeSaleForm} style={{color:"white"}} level={1}>VENTA</Title>
        );
    };

    SaleCardColStyle = {
        marginBottom:"20px"
    };
    ShiftSaleTableColStyle = {
        width:"100%",
        height:"100%",
        textAlign:"center"
    };
    tableStyle = {
        width: "100%",
    };

    CardGridStyle = color => {
        return {
            background: color,
            color: "white",
            width: '100%',
            height: '200px',
            alignContent: "center",
            padding: "0px"
        };
    };
    CardStyle = color => {
        return {
            width: "100%",
            height: "100%",
            background: color,
            color: "white"
        };
    };
    CardHeadStyle = color => {
        return {
            background: color,
            color: "white",
            borderBottomColor: color,
            textAlign: "center",
            paddingBottom: "0px"
        };
    };
    CardBodyStyle = color => {
        return {
            background: color,
            color: "white",
            borderBottomColor: color,
            textAlign: "center",
            justifyContent: "center",
            alignItems:"center",
            verticalAlign:"middle",
            width:"100%",
            height:"100%"
        };
    };
    WarehousePicker = () =>{
        return (
            <Dropdown.Button overlay={this.menu} icon={<Icon type="bank" />}>
                {this.state.warehouse}
            </Dropdown.Button>
        );
    };

    handleMenuClick = value => {
        console.log("values to be clkec: ",value);
        let idWarehouse = this.props.nameIdWarehouseHashMap[value.key];
        this.props.setIdWarehouse(idWarehouse);
        this.setState({warehouse:value.key});

        //setIdWarehouse{}
    };

    menuStyle = {
    };

    menuItemStyle = {
        width:"120px"
    };

    menu = () => {
        let MenuItems = this.props.nameWarehouse.map(warehouse => <Menu.Item style={this.menuItemStyle} key={warehouse}>{warehouse}</Menu.Item>)
        return (
            <Menu style={this.menuStyle} onClick={this.handleMenuClick}>
                {MenuItems}
            </Menu>
        );
    };

    SaleCard = () => {
        return (
            <Card.Grid
                style={this.CardGridStyle("#2b5797")}
            >
                <Card
                    bordered={false}
                    style={this.CardStyle("#2b5797")}
                    headStyle={this.CardHeadStyle("#2b5797")}
                    bodyStyle={this.CardBodyStyle("#2b5797")}
                >
                    <div>
                        {this.SaleTitle()}
                        {this.WarehousePicker()}
                        <br/>
                        <br/>
                        <Button onClick={this.goToMakeSaleForm}>Realizar Venta</Button>
                    </div>
                </Card>
            </Card.Grid>
        );
    };


    render() {
        return (
            <div>
                <Row>
                    <Col span={24} style ={this.SaleCardColStyle}>
                        {this.SaleCard()}
                    </Col>
                    <Col span={24} style ={this.ShiftSaleTableColStyle}>
                        { this.props.idShift && <PaginatedLazyTable
                            idShift={this.props.idShift}
                            idAppUser={this.props.idAppUser}
                            columnDefs={this.state.columnDefs}
                            loadTablePage={this.loadSaleTablePage}
                            length={this.props.saleCount}
                            onRowClick={this.onRowClick}
                            title={"Ventas"}
                        />}
                    </Col>
                </Row>

            </div>
        );
    };
}

const mapStateToProps = state => {
    const { appUserReducer, warehouseReducer, shiftReducer } = state;
    const { idAppUser, idShift } = appUserReducer;
    const { saleCount } = shiftReducer;
    const { nameWarehouse, nameIdWarehouseHashMap } = warehouseReducer;
    console.log("nameWarehouse for MAKESALE: ",nameWarehouse);
    return {idAppUser, nameWarehouse, nameIdWarehouseHashMap, idShift, saleCount};
};

export default withRouter(connect(mapStateToProps, { setIdWarehouse })(MakeSale));
