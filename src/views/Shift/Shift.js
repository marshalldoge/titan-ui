import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col } from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import "../../redux/reducers/appUserReducer"
import "../../stylesheets/views/shift/_shift.scss"
import {connect} from "react-redux";
import moment from "moment";
import {deleteCookie, getCookie, withParams} from "../../utils";
import * as constants from "../../constants";
import "./_Shift.scss";
import {closeShift, openShift, setIdShift, setShift} from "../../redux/actions";
import clientReducer from "../../redux/reducers/clientReducer";

const Button = React.lazy(() => import("../../components/TButton/TButton"));
const PaginatedLazyTable= React.lazy(() => import("../../components/PaginatedLazyTable/PaginatedLazyTable"));

class Shift extends Component {

    state = {
        cashOpen:0,
        inShift:this.props.inShift,
        columnDefs: [
            {headerName: "ID", field: "id", width: "10%"},
            {headerName: "Hora", field: "time", width: "15%"},
            {headerName: "Cliente", field: "billName", width: "30%"},
            {headerName: "Pagado", field: "paid", width: "15%"},
            {headerName: "Total", field: "total", width: "15%"},
            {headerName: "Moneda", field: "currency", width: "15%"}
        ],
        windowHeight: document.body.clientHeight,
        now: moment()
    };

    componentDidMount() {

    }


    componentDidUpdate(prevProps, prevState, snapshot) {
       /* if (this.props.inShift !== prevProps.inShift) {
            console.log("Past idShift: ",prevProps.inShift," vs current: ",this.props.inShift);
            if(this.props.inShift) {
                this.setState({cardDisplayed: "Shift"});
            }else{
                this.setState({cardDisplayed: "NotOpened"});
            }
        }

        */
    }
    componentWillUnmount() {

    }

    createShift = () => {
        let headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let params = {
            idAppUser: this.props.idAppUser,
            action: "create",
            time: this.state.now
        };
        let timeOpened = this.state.now.clone();
        let openFormatted = timeOpened.format("YYYY-MM-DD[T]HH:mm:ss");
        let body =JSON.stringify({
            idAppUser:this.props.idAppUser,
            cashOpen:this.state.cashOpen,
            cashClosed:this.state.cashOpen,
            open:openFormatted,
            idCompany: this.props.idCompany,
            saleCount:this.props.saleCount
        });
        let me = this;
        let url = withParams(constants.BACKEND_URL+"/pos/Shift", params);
        fetch(url, {
            method: "POST",
            headers: headers,
            body: body
        })
             .then(response => response.json())
             .then(function (data) {
                 console.log("Shift created and retrieved forn database: ",data);
                 me.setState({open:timeOpened},() =>{
                     me.props.setIdShift(data);
                     data["open"]=timeOpened;
                     me.props.openShift(data);
                     me.setState({inShift: true});
                 });
             });
    };

    closeShift = () => {
        let headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let params = {
            idAppUser: this.props.idAppUser,
            action: "update"
        };
        let timeClosed = this.state.now.clone();
        let closeFormatted = timeClosed.format("YYYY-MM-DD[T]HH:mm:ss");

        //Duration of shift
        let now = this.state.now;
        let open = this.props.open;
        //console.log("CLOSE SHIFT: open: ",open," to now: ",now);
        let diff = now.diff(open);
        //console.log("DIFF: ",diff);
        let duration = moment.duration(diff).asSeconds();
        //console.log("DURATION :",duration);

        let body =JSON.stringify({
            id: this.props.idShift,
            idAppUser:this.props.idAppUser,
            cashClose:this.state.cashClose,
            close:closeFormatted,
            duration:duration
        });
        let me = this;
        let url = withParams(constants.BACKEND_URL+"/pos/Shift", params);
        fetch(url, {
            method: "POST",
            headers: headers,
            body: body
        })
             .then(response => response.json())
             .then(function (data) {
                 data.id=null;
                 me.props.setShift(data);
                 me.props.setIdShift(data);
                 me.props.closeShift();
                 me.setState({inShift:false});
             });
    };

    goToMakeSaleForm = () => {
        this.props.history.push("/MakeSaleForm");
    };

    MakeSaleButton = () => {
        return (
             <Button
                  label={"Realizar Venta"}
                  size={"expanded"}
                  onClick={this.goToMakeSaleForm}
             />
        );
    };

    OpenShiftButton = () => {
        return (
             <Button
                label={"Abrir Caja"}
                size={"expanded"}
                onClick={this.createShift}
             />
        );
    };

    CloseShiftButton = () => {
        return (
             <Button
                  label={"Cerrar Caja"}
                  size={"medium"}
                  onClick={this.closeShift}
                  type={"inverse"}
             />
        );
    };

    loadSaleTablePageByIdShift(page) {
        //console.log("sale tale props: ",this.props);
        //console.log("Loading page: ",page);
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idAppUser: this.props.idAppUser,
            idShift: this.props.idShift,
            page: page,
            pageSize: this.props.pageSize
        };
        let url = withParams(constants.BACKEND_URL + "/pos/Sale/findSaleByIdAppUserAndIdShiftPaginated", params);
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
                             response.data.content[i]["billName"] = me.props.clientHashMap[response.data.content[i].idCurrency].billName;
                             response.data.content[i]["currency"] = me.props.currencyHashMap[response.data.content[i].idCurrency].abbreviation;
                             console.log("new: ",response.data.content[i]["currency"]);
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
        this.props.history.push({
            pathname: "SaleProfile",
            search: "?idSale=" + record.id
        })
    };

    SaleTable = () => {
        return(
             <PaginatedLazyTable
                  clientHashMap = {this.props.clientHashMap}
                  currencyHashMap = {this.props.currencyHashMap}
                  idAppUser={this.props.idAppUser}
                  idShift={this.props.idShift}
                  columnDefs={this.state.columnDefs}
                  loadTablePage={this.loadSaleTablePageByIdShift}
                  length={12}
                  onRowClick={this.onRowClick}
                  title={"Ventas"}
                  pageSize={11}
             />
        );
    };

    render() {
        console.log("inShift? ",this.state.inShift);
        return (
             <div>
                 <Row style={{height: "60px",paddingTop: "10px"}} type="flex" justify="center">
                     <Col span={24}>
                         {this.state.inShift?this.MakeSaleButton():this.OpenShiftButton()}
                     </Col>
                 </Row>
                 <Row type="flex" justify="center">
                     <Col span={24}>
                         { this.state.inShift && this.SaleTable()}
                     </Col>
                 </Row>
                 <Row type="flex" justify="end">
                     <Col span={6} style={{textAlign: "end"}}>
                         {this.state.inShift && this.CloseShiftButton()}
                     </Col>
                 </Row>
             </div>
        );
    }
}

const mapStateToProps = state => {
    const { appUserReducer, shiftReducer, currencyReducer, clientReducer } = state;
    const { idAppUser, idShift, inShift, saleCount } = appUserReducer;
    const { open } = shiftReducer;
    const { currencyHashMap } = currencyReducer;
    const { clientHashMap } = clientReducer;
    console.log("idShift Received: ",idShift);
    return {idAppUser, idShift, open, inShift, saleCount, currencyHashMap, clientHashMap};
};

export default withRouter(connect(mapStateToProps,{openShift, setIdShift, closeShift, setShift})(Shift));
