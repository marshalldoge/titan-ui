import React, { Component} from "react";
import { withRouter} from "react-router-dom";
import {Row, Col, Pagination} from "antd";
import { getCookie, withParams} from "../../utils.js";
import * as constants from "../../constants"
import {connect} from "react-redux";
import "antd/dist/antd.css";
import "../../redux/reducers/moduleReducer";
import "../../stylesheets/components/appUserTable/_appUserTable.scss";
import "./_ItemStock.scss";

class ItemStock extends Component {

    state={
        itemData:[],
        pageData:{
            0:[],
            1:[]
        },
        pageRange: {
            first: 0,
            last: 1
        },
        expanded: {},
        currentPage:0,
        pageSize: 20
    };

    componentDidMount() {
        for(let i=0;i<2;i++){
            this.loadItemTablePage(i);
        }
    }

    loadItemTablePage = page => {
        //console.log("sale tale props: ",this.props);
        //console.log("Loading page: ",page);
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            page: page,
            pageSize: this.state.pageSize
        };
        let url = withParams(constants.BACKEND_URL + "/wms/Item/findAllPaginated", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function (response) {
                //console.log("me in getpage fetch is ",me);
                if(response.success){
                    //console.log("Page data received: ",response);
                    me.setState ((prevState) =>{
                        for(let i = 0; i < response.data.content.length; i++) {
                            response.data.content[i]["isExpanded"] = false;
                        }
                        prevState.pageData[page] = response.data.content;
                        return prevState;
                    });
                }
            }).catch(function (error) {
            console.log(error);
        });
    };

    Title = () => {
        return (
             <h1>{"Productos"}</h1>
        );
    };

    onRowClick = record => {
        //const idSale = record.id;
        console.log("Clicked row: ",record);
        //TODO add an Item Profile so you can enter it by this component
        /*
        this.props.history.push({
            pathname: "ItemProfile",
            search: "?idItem=" + idItem
        })
         */
    };

    expandItemBox = (e,item,index) => {
        this.setState ((prevState) =>{
            prevState.pageData[this.state.currentPage][index].isExpanded =
                 !prevState.pageData[this.state.currentPage][index].isExpanded;
            return prevState;
        });
    };

    ItemBox = (item,index) => {
        let me=this;
        let conversionArray;
        let firstRow=[],secondRow=[];
        if(item.conversion) {
            conversionArray = item.conversion.split('x').map((measure,index) => {
                //console.log("Item: ",item);
                let regexStr = measure.match(/[a-z]+|[^a-z]+/gi);
                let measureName = regexStr[regexStr.length-1];
                let idWarehouse = 1;
                let itemCode = item.code;
                let quantity = me.props.itemQuantityHashMap[idWarehouse][itemCode+"_"+measureName]?
                     me.props.itemQuantityHashMap[idWarehouse][itemCode+"_"+measureName].quantity:0;
                //console.log("Quntity: ",quantity);
                return (
                    <Col key={index} span={8}>{measureName}: {quantity}</Col>
                );
            });
            firstRow = conversionArray.slice(0,2);
            secondRow = conversionArray.slice(2);
            //console.log("firstRow: ",firstRow);
            //console.log("seconfRow: ",secondRow);
        }else{
            conversionArray = [];
        }
        return(
          <div className={"itemBox"} key={index} onClick={(e,item) => this.expandItemBox(e,item,index)}>
              <Row align="middle">
                  <Col className={"itemCode"} span={3}>{item.code}</Col>
                  <Col className={"itemName"} span={6}>{item.description}</Col>
                  <Col span={15}>
                      <Row>
                          {firstRow}
                      </Row>
                      <Row>
                          {secondRow}
                      </Row>
                  </Col>
              </Row>
              <br/>
              {item.isExpanded?this.WarehouseDescription(item):null}
          </div>
        );
    };

    WarehouseDescription = (item) => {
        let me = this;
        let numberOfMeasures = item.conversion.split('x').length;
        let conversionArray = item.conversion.split('x').map((measure,index) => {
            //console.log("Item: ",item);
            let regexStr = measure.match(/[a-z]+|[^a-z]+/gi);
            let measureName = regexStr[regexStr.length-1];
            let idWarehouse = 1;
            let itemCode = item.code;
            let quantity = me.props.itemQuantityHashMap[idWarehouse][itemCode+"_"+measureName]?
                 me.props.itemQuantityHashMap[idWarehouse][itemCode+"_"+measureName].quantity:0;
            //console.log("Quntity: ",quantity);
            return (
                 <Col key={index} span={15/numberOfMeasures}>{measureName}: {quantity}</Col>
            );

            //Gotta do this measure for every warehouse
            for(let warehouse in this.props.nameIdWarehouseHashMap){
                if(this.props.nameIdWarehouseHashMap.hasOwnProperty(warehouse)) {
                    console.log("NANI? ",warehouse);
                    WarehouseNames.push(
                         <Row key={cont}>
                             {warehouse}
                         </Row>
                    );
                    cont++;
                }
            }
        });
        let WarehouseNames = [];
        let cont = 0;
        for(let warehouse in this.props.nameIdWarehouseHashMap){
            if(this.props.nameIdWarehouseHashMap.hasOwnProperty(warehouse)) {
                console.log("NANI? ",warehouse);
                WarehouseNames.push(
                     <Row key={cont}>
                         {warehouse}
                     </Row>
                );
                cont++;
            }
        }
        return (
             <Row align="middle">
                 <Col className={"itemCode"} span={3}>{""}</Col>
                 <Col className={"warehouseName"} span={6}>
                     {WarehouseNames}
                 </Col>
             </Row>
        );
    };

    Container = () => {
        let boxes = this.state.pageData[this.state.currentPage].map((item,index) => this.ItemBox(item,index));
        return (
          <div className={"itemCtn"}>
              {boxes}
          </div>
        );
    };

    pagination = () => {
        console.log("toal for pagination: ",this.props.length);
        return(
            <Pagination
                current={this.state.currentPage+1}
                onChange={this.onChange}
                total={this.props.ItemCount}
                pageSize={this.state.pageSize}
            />
        );
    };

    onChange = page => {
        //console.log("OnChange: State data: ",page);
        if(page>this.state.currentPage){
            //console.log("loading next page:");
            this.loadItemTablePage(this.state.pageRange.last+1);
            this.setState(state => {
                let pageRange = state.pageRange;
                pageRange.last=pageRange.last+1;
                return {
                    pageRange:pageRange
                }
            });
        }else{
            //Not erasing data, so this is not necesary yet.
            //this.props.loadSaleTablePage(this.state.pageRange.first-1);
        }
        console.log("Showing page: ",page-1);
        this.setState({
            currentPage: page-1,
        });
    };


    render() {
        console.log("Props: ",this.props);
        return (
            <div>
                {this.Title()}
                {this.Container()}
                <br/>
                {this.pagination()}
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

export default withRouter(connect(mapStateToProps)(ItemStock));
