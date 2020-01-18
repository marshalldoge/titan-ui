import React, { Component} from "react";
import { withRouter} from "react-router-dom";
import {Row, Col, Pagination} from "antd";
import { getCookie, withParams} from "../../utils.js";
import * as constants from "../../constants"
import {connect} from "react-redux";
import "antd/dist/antd.css";
import "../../redux/reducers/moduleReducer"
import "../../stylesheets/components/appUserTable/_appUserTable.scss";

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
        currentPage:0
    };

    componentDidMount() {
        for(let i=0;i<2;i++){
            this.loadItemTablePageByIdSale(i);
        }
    }

    loadItemTablePageByIdSale = page => {
        //console.log("sale tale props: ",this.props);
        //console.log("Loading page: ",page);
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            page: page,
            pageSize: this.props.pageSize?this.props.pageSize:10
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
                        prevState.pageData[page]=response.data.content;
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
        //TODO add an Item Profile so you can enter it by this component
        /*
        this.props.history.push({
            pathname: "ItemProfile",
            search: "?idItem=" + idItem
        })
         */
    };

    itemBoxStyle = {
        borderRadius:"10px",
        verticalAlign: "center",
        height: "100%",
        width:"300x"
    };

    rowStyle = {
        background:"white",
        height: "50px",
        borderRadius: "10px"
    };

    itemBox = (item,index) => {
        let me=this;
        let conversionArray;
        let firstRow=[],secondRow=[];
        if(item.conversion) {
            conversionArray = item.conversion.split('x').map((measure,index) => {
                console.log("Item: ",item);
                let regexStr = measure.match(/[a-z]+|[^a-z]+/gi);
                let measureName = regexStr[regexStr.length-1];
                let idWarehouse = 1;
                let itemCode = item.code;
                let quantity = me.props.itemQuantityHashMap[idWarehouse][itemCode+"_"+measureName].quantity;
                console.log("Quntity: ",quantity);
                return (
                    <Col key={index} span={8}>{measureName}: {quantity}</Col>
                );
            });
            firstRow = conversionArray.slice(0,2);
            secondRow = conversionArray.slice(2);
            console.log("firstRow: ",firstRow);
            console.log("seconfRow: ",secondRow);
        }else{
            conversionArray = [];
        }
        return(
          <div style={this.itemBoxStyle} key={index}>
              <Row style={this.rowStyle}>
                  <Col span={4}>{item.code}</Col>
                  <Col span={7}>{item.description}</Col>
                  <Col span={13}>
                      <Row>
                          {firstRow}
                      </Row>
                      <Row>
                          {secondRow}
                      </Row>
                  </Col>
              </Row>
              <br/>
          </div>
        );
    };

    container = () => {
        let boxes = this.state.pageData[this.state.currentPage].map((item,index) => this.itemBox(item,index));
        return (
          <div>
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
                total={this.props.length}
                pageSize={this.props.pageSize?this.props.pageSize:10}
            />
        );
    };

    onChange = page => {
        //console.log("OnChange: State data: ",page);
        if(page>this.state.currentPage){
            //console.log("loading next page:");
            this.loadTablePage(this.state.pageRange.last+1);
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
                {this.container()}
                {this.pagination()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { appUserReducer, moduleReducer, itemQuantityReducer } = state;
    const { idCompany, idAppUser } = appUserReducer;
    const { modules } = moduleReducer;
    const { itemQuantityCode, itemQuantityHashMap } = itemQuantityReducer;
    console.log("Itemquantity hashmap: ",itemQuantityHashMap);
    return {idCompany,idAppUser, modules, itemQuantityHashMap, itemQuantityCode};
};

export default withRouter(connect(mapStateToProps)(ItemStock));
