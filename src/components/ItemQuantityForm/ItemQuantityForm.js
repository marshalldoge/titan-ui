import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {Col, Row, Input, Typography, AutoComplete,Icon} from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import "../../redux/reducers/appUserReducer"
import {connect} from "react-redux";
import { increaseSaleCount, increaseClientSaleCount } from "../../redux/actions";
import {getCookie, withParams} from "../../utils";
import * as constants from "../../constants";
import "./_ItemQuantityForm.scss";
import moment from "moment";

const { Title } = Typography;
const Button = React.lazy(() => import("../TButton/TButton"));

class ItemQuantityForm extends Component {
    constructor(props) {
        super(props);
        this.removeItem.bind(this);
    }

    state = {
        saleItemQuantities:{
            0: {
              hashcode: "",
              name: "",
              salePrice: "",
              quantity: "",
              total: ""
            }
            },
        lastItemId:0,
        total:0
    };

    saveSale = () => {
        let me=this;
        let itemQuantities = [];
        let saleItemQuantities = this.state.saleItemQuantities;
        //console.log("lasditem id: ",this.state.lastItemId);
        for(let item in saleItemQuantities){
            if(saleItemQuantities.hasOwnProperty(item)) {
                let itemObject = saleItemQuantities[item];
                if(parseInt(item) !== parseInt(this.state.lastItemId)){
                    //console.log("Adding ",item," vs ",this.state.lastItemId);
                    itemQuantities.push(itemObject);
                }
            }
        }
        let time = moment().format("YYYY-MM-DD[T]HH:mm:ss");
        let body = JSON.stringify({
            idAppUser:this.props.idAppUser,
            idClient:this.props.client.id,
            billName:this.props.billName,
            nit:this.props.nit,
            idShift:this.props.idShift,
            idCurrency:"1", //TODO Retrieve this from AppUser or some other Model
            idCompany:this.props.idCompany,
            idWarehouse: this.props.idWarehouse,
            time:time,
            total:this.state.total,
            itemQuantities:itemQuantities,
            paid:this.state.total
        });
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let params = {

        };
        var url = withParams(constants.BACKEND_URL+"/Sale", params);
        fetch(url, {
            method: "POST",
            headers: headers,
            body:body
        }).then(response => response.json())
            .then(function(data) {
                if(data.success){
                    console.log("Sale saved successfully");
                    me.props.increaseClientSaleCount(me.props.client.id);
                    me.props.increaseSaleCount();
                }else{
                    console.log("Failed with error ",data.statusMessage);
                }
            });
    };

    styleHeaderRow = {
        borderWidth:"4px",
        borderRadius: "10px",
        height: "50px",
        background: "white"
    };
    styleRow = {
        borderWidth:"4px",
        borderRadius: "10px",
        height: "50px",
        background: "white"
    };
    styleCell = {
        height:"100%",
        display : "flex",
        alignItems : "center",
        justifyContent: "center",
        textAlign:"center"
        //marginLeft:"5px",
        //marginRight:"5px"
    };
    styleInputName = {
        width:"90%"
    };
    styleInputNumber = {
        width:"80%"
    };
    onSelect = (value,option,idSaleItem) => {
        let saleItemQuantities = this.state.saleItemQuantities;
        console.log("IdSaleItem rendered: ",idSaleItem);
        saleItemQuantities[idSaleItem]["hashcode"]=value;
        this.setState({saleItemQuantities:saleItemQuantities},() => this.fillRowData(value,idSaleItem));
    };

    handleCodeChange = (value,idSaleItem) => {
        let saleItemQuantities = this.state.saleItemQuantities;
        console.log("IdSaleItem rendered: ",idSaleItem);
        saleItemQuantities[idSaleItem]["hashcode"]=value;
        if(idSaleItem === this.state.lastItemId) {
            saleItemQuantities[idSaleItem + 1] = {
                hashcode: "",
                name: "",
                salePrice: "",
                quantity: "",
                total: ""
            };
        }
        this.setState({saleItemQuantities:saleItemQuantities},() => {
            this.fillRowData(value,idSaleItem)
        });
    };

    handleSPChange = (e,idSaleItem) => {
        let value = e.target.value;
        let saleItemQuantities = this.state.saleItemQuantities;
        saleItemQuantities[idSaleItem]["salePrice"]=value;
        if(value === "")value=0;
        let valueQuantity = saleItemQuantities[idSaleItem]["quantity"]===""?0:saleItemQuantities[idSaleItem]["quantity"];
        let totalBefore =parseFloat(saleItemQuantities[idSaleItem]["total"]);
        saleItemQuantities[idSaleItem]["total"]=parseFloat(value)* parseFloat(valueQuantity);
        //Updating the total of sale
        let totalSale = this.state.total;
        this.setState({total:totalSale-totalBefore+saleItemQuantities[idSaleItem]["total"]});
        this.setState({saleItemQuantities:saleItemQuantities});
    };

    handleQuantityChange = (e,idSaleItem) => {
        let value = e.target.value;
        let saleItemQuantities = this.state.saleItemQuantities;
        saleItemQuantities[idSaleItem]["quantity"]=value;
        if(value === "")value=0;
        let valueSalePrice = saleItemQuantities[idSaleItem]["salePrice"]===""?0:saleItemQuantities[idSaleItem]["salePrice"];
        let totalBefore =parseFloat(saleItemQuantities[idSaleItem]["total"]);
        console.log(value," * ",valueSalePrice);
        saleItemQuantities[idSaleItem]["total"]= parseFloat(value)* parseFloat(valueSalePrice);
        //Updating the total of sale
        let totalSale = this.state.total;
        this.setState({total:totalSale-totalBefore+saleItemQuantities[idSaleItem]["total"]});
        this.setState({saleItemQuantities:saleItemQuantities});
    };

    fillRowData = (hashcode,idSaleItem) => {
        //onsole.log("Looking the hashcode entered in ",this.props.itemQuantityHashMap[this.props.idWarehouse]);
        let itemData = this.props.itemQuantityHashMap[this.props.idWarehouse][hashcode];
        //console.log("For the hashcode: ",hashcode," there is this information: ",itemData);
        if(itemData !== undefined){
            let saleItemData = this.state.saleItemQuantities;
            saleItemData[idSaleItem]={
                hashcode:hashcode,
                name:itemData.name,
                salePrice:itemData.salePrice,
                quantity:1,
                total:itemData.salePrice,
                idMeasure:itemData.idMeasure,
                idCurrency:itemData.idCurrency,
                idItem:itemData.idItem
            };
            //Updating the total of sale
            let totalSale = this.state.total;
            this.setState({total:totalSale+saleItemData[idSaleItem].total});
            this.setState({saleItemQuantities:saleItemData});
            if(idSaleItem === this.state.lastItemId)this.setState({lastItemId:idSaleItem+1})
        }else{
            console.log("Code not found");
            let saleItemData = this.state.saleItemQuantities;
            saleItemData[idSaleItem]={
                hashcode:hashcode,
                name:"",
                salePrice:"",
                quantity:0,
                total:0
            };
            this.setState({saleItemQuantities:saleItemData});
        }
    };

    removeItem = idSaleItem => {
        let saleItemQuantities = this.state.saleItemQuantities;
        //console.log("IdSaleItem rendered: ",idSaleItem);
        delete saleItemQuantities[idSaleItem];
        this.setState({saleItemQuantities:saleItemQuantities});
    };

    removeItemButton = idSaleItem => {
        //console.log(idSaleItem," vs ",this.state.lastItemId);
      if(idSaleItem !== this.state.lastItemId)  {
          /*return(
              <TButton type={"danger"} icon={"close"} onClick={()=>this.removeItem(idSaleItem)}/>
          );

           */
          return (
            <Button
                 type={"danger"}
                 label={<Icon type="close" />}
                 onClick={()=>this.removeItem(idSaleItem)}

            />
          );
      }else{
          return null;
      }
    };

    headers = () => {
        return(
            <Row type="flex" className={"headerCtn"} style={this.styleHeaderRow}>
                <Col span={4} order={1} >
                    Código
                </Col>
                <Col span={5} order={2} >
                    Name
                </Col>
                <Col span={4} order={3} >
                    Cantidad
                </Col>
                <Col span={4} order={4} >
                    PV
                </Col>
                <Col span={4} order={5} >
                    Total
                </Col>
                <Col span={3} order={5} >
                    Remover
                </Col>
            </Row>
        );
    };

    SaleItemQuantity = () => {
        let me=this;
        //console.log("Renderign saleItemQuantities: ",this.state.saleItemQuantities);
        let saleIQ = this.state.saleItemQuantities;
        let saleItemQuantities = [];
        for(let idSaleItem in saleIQ){
            if(saleIQ.hasOwnProperty(idSaleItem)){
                saleItemQuantities.push(me.ItemQuantity(saleIQ[idSaleItem],parseInt(idSaleItem)));
            }
        }
        return(
            <div style={{}}>
                {saleItemQuantities}
                <br/>
                <Row>
                    <Col span={10} style={{textAlign:"start"}}>
                        <Button
                             label={"Total: "+this.state.total}
                             size={"big"}
                        />
                    </Col>
                    <Col span={8} offset={6} style={{textAlign:"end"}}>
                        <Button
                             type={"inverse"}
                             onClick={this.saveSale}
                             label={"GUARDAR"}
                             size={"big"}
                        />
                    </Col>
                </Row>
            </div>
        );
    };

    ItemQuantity = (itemQuantity,idSaleItem) => {
        //console.log("Rendering itemquanitity for: ",itemQuantity," with hashcode ",idSaleItem);
        return(
            <Row type="flex" style={this.styleRow} key={idSaleItem}>
                <Col span={4} order={1} style={this.styleCell}>
                    <AutoComplete
                        style={this.styleInputName}
                        dataSource={this.props.itemQuantityCode[this.props.idWarehouse]}
                        onSelect={ (value,option) => this.onSelect(value,option,idSaleItem)}
                        placeholder="Codigo..."
                        filterOption = {true}
                        onChange={value => this.handleCodeChange(value,idSaleItem)}
                        value={itemQuantity["hashcode"]}
                    />
                </Col>
                <Col span={5} order={2} style={this.styleCell}>
                    <Input style={this.styleInputName} value={itemQuantity["name"]}/>
                </Col>
                <Col span={4} order={3} style={this.styleCell}>
                    <Input style={this.styleInputNumber} value={itemQuantity["quantity"]}
                           onChange={value =>this.handleQuantityChange(value,idSaleItem)}/>
                </Col>
                <Col span={4} order={4} style={this.styleCell}>
                    <Input style={this.styleInputNumber} value={itemQuantity["salePrice"]}
                           onChange={value =>this.handleSPChange(value,idSaleItem)}/>
                </Col>
                <Col span={4} order={5} style={this.styleCell}>
                    <Input style={this.styleInputNumber} value={itemQuantity["total"]}/>
                </Col>
                <Col span={3} order={5} style={this.styleCell}>
                    {this.removeItemButton(idSaleItem)}
                </Col>
            </Row>
        );
    };


    render() {
        return (
            <div>
                {this.headers()}
                {this.SaleItemQuantity()}
            </div>
        );
    };
}

const mapStateToProps = state => {
    const { appUserReducer, itemQuantityReducer } = state;
    const { idAppUser,idWarehouse, idShift, idCompany } = appUserReducer;
    const { itemQuantityCode, itemQuantityHashMap } = itemQuantityReducer;
    //console.log("ItemQuantity in sale form: ",itemQuantityCode);
    console.log("Codes to be displayed for autocomplete: ",itemQuantityCode[idWarehouse]);
    return {idAppUser, itemQuantityCode, idWarehouse, itemQuantityHashMap, idShift, idCompany};
};

export default withRouter(connect(mapStateToProps,{increaseSaleCount,increaseClientSaleCount})(ItemQuantityForm));
