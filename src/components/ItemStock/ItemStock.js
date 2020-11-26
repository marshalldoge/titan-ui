import React, { Component} from "react";
import { withRouter} from "react-router-dom";
import { Row, Col, Pagination } from "antd";
import { getCookie, withParams} from "../../utils.js";
import * as constants from "../../constants"
import {connect} from "react-redux";
import "antd/dist/antd.css";
import "../../redux/reducers/moduleReducer";
import "../../stylesheets/components/appUserTable/_appUserTable.scss";
import "./_ItemStock.scss";

const TButton = React.lazy(() => import("../TButton/TButton"));
const Title = React.lazy(() => import("../TTitle/TTitle"));
const TransformItemModal = React.lazy(() => import("../TransformItemModal/TransformItemModal"));

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
        currentPage:0,
        pageSize: 9,
	    itemToTransform: {},
	    isModalOpen: false,
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
        let url = withParams(constants.BACKEND_URL + "/Item/findAllPaginated", params);
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

    loadWarehouseStock = (index, idItem) => {
        //console.log("sale tale props: ",this.props);
        //console.log("Loading page: ",page);
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idCompany: this.props.idCompany,
            idItem: idItem
        };
        let url = withParams(constants.BACKEND_URL + "/WarehouseItemQuantity/warehouseStock", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
             .then(function (response) {
                 //console.log("me in getpage fetch is ",me);
                 if(response.success){
                     //console.log("Page data received: ",response);
                     me.setState ((prevState) =>{
                         prevState.pageData[me.state.currentPage][index]["warehouseStock"] =
                              response.data;
                         return prevState;
                     });
                 }
             }).catch(function (error) {
            console.log(error);
        });
    };

    Title = () => {
        return (
             <Title
                label={"Productos"}
                size={"big"}
             />
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
        console.log("Item: ",item);
        this.loadWarehouseStock(index,item.id);
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
                let itemCode = item.code;
	            let quantity = 0;
	            for (let warehouse in this.props.nameIdWarehouseHashMap) {
		            if (Object.prototype.hasOwnProperty.call(this.props.nameIdWarehouseHashMap, warehouse)) {
			            let idWarehouse = this.props.nameIdWarehouseHashMap[warehouse];
			            quantity += me.props.itemQuantityHashMap[idWarehouse][itemCode+"_"+measureName]?
				             me.props.itemQuantityHashMap[idWarehouse][itemCode+"_"+measureName].quantity:0;
		            }
	            }
                //console.log("Quntity: ",quantity);
                return (
                    <Col key={index} span={4}>{measureName}: {quantity}</Col>
                );
            });
            firstRow = conversionArray;
            //console.log("firstRow: ",firstRow);
            //console.log("seconfRow: ",secondRow);
        }else{
            conversionArray = [];
        }
        return(
          <div className={"itemBox"} key={index} onClick={(e) => this.expandItemBox(e,item,index)}>
              <Row type={"flex"} align="middle">
                  <Col className={"itemCode"} span={3}>{item.code}</Col>
	              <Col span={21}>
		              <Row type={"flex"} align={"middle"}>
			              <Col className={"itemName"} span={8}>{item.name}</Col>
			              {firstRow}
		              </Row>
	              </Col>
              </Row>
              <br/>
              {item.isExpanded&&item.warehouseStock?this.WarehouseDescription(item):null}
          </div>
        );
    };

    WarehouseDescription = (item) => {
        console.log("Item Warehouse stocks: ",item.warehouseStock);
        //TODO CALCULATE THE NUMBER OF MEASURES AND SEND IT TO SIZE PARAMETER
        let WarehouseRows = item.warehouseStock.map(
             (warehouse,index) => this.WarehouseRow(warehouse,4,index,index!==item.warehouseStock.length-1)
        );
        return (
             <Row type={"flex"} className={"warehouseDescriptionCtn"} align="middle">
                 <Col className={"moveButtonCtn"} span={3}>
                     <Row type={"flex"} justify={"center"}>
                         <TButton
                              type={"inverse"}
                              size={"icon"}
                              icon={"setting"}
                              inverse={true}
                              onClick={()=> this.setState({
	                              itemToTransform: item,
	                              isModalOpen: true
                              }) }
                         />
                     </Row>
                 </Col>
                 <Col className={"warehouseCtn"} span={21}>
                     {WarehouseRows}
                 </Col>
             </Row>
        );
    };

    WarehouseRow = (item,size,index,isInMiddle) => {
        let stock = item.stock;
        let measureCols = [];
        let colSpan = Math.floor(16/size);
        let key = 0;
        console.log('Span: ',colSpan);
        for(let measure in stock){
            if(stock.hasOwnProperty(measure)) {
                console.log(measure," => ",stock[measure]);
                measureCols.push(
                     <Col key={key} span={colSpan}>{measure+": "+stock[measure]}</Col>
                );
                key++;
            }
        }
        return (
             <Row type={"flex"} key={index} className={"warehouseRow"+(isInMiddle?" middle":"")} align={"middle"}>
                 <Col className={"warehouseName"} span={8}>{item.warehouseName}</Col>
                 {measureCols}
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
	            <TransformItemModal
		             isOpen={this.state.isModalOpen}
		             item={this.state.itemToTransform}
		             onClose={()=>this.setState({
			             isModalOpen: false
		             })}
	            />
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
    const ItemCount = itemQuantityCode[1].length;
    return {idCompany,idAppUser, modules, itemQuantityHashMap, itemQuantityCode, ItemCount, nameIdWarehouseHashMap};
};

export default withRouter(connect(mapStateToProps)(ItemStock));
