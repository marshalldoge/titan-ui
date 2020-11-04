import React, { Component} from "react";
import { withRouter} from "react-router-dom";
import { Table } from "antd";
import { getCookie, withParams} from "../../utils.js";
import * as constants from "../../constants"
import {connect} from "react-redux";
import moment from "moment";
import "antd/dist/antd.css";
import "../../redux/reducers/moduleReducer"
import "../../stylesheets/components/appUserTable/_appUserTable.scss";

const PaginatedLazyTable= React.lazy(() => import("../../components/PaginatedLazyTable/PaginatedLazyTable"));

class ShiftTable extends Component {
    constructor(props) {
        super(props);
        this.goToShiftProfile = this.goToShiftProfile.bind(this);
        //console.log("Props received by SALETABLE: ",props);
    }

    state={
        columns: [],
        data: [],
        columnDefs: [
            {headerName:"ID", width:"10%", field:"id"},
            {headerName:"Fecha", width:"15%", field:"time"},
            {headerName:"Abrió", width:"15%", field:"open"},
            {headerName:"Cerró", width:"15%", field:"close"},
            {headerName:"Duración", width:"15%", field:"duration"},
            {headerName:"Dinero Inicio", width:"15%", field:"cashOpen"},
            {headerName:"Dinero Fin", width:"15%", field:"cashClose"},
        ]
    };

    componentDidMount() {
        console.log("IdAppUser to load shiftTable: ",this.props.idAppUser);
        //if(this.props.idAppUser !== undefined)this.loadData();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.idAppUser !== prevProps.idAppUser) {
            //console.log("Past idAppUser: ",prevProps.idAppUser," vs current: ",this.props.idAppUser);
            this.loadData();
        }
    }

    loadShiftTablePage(page) {
        console.log("Loading page: ",page);
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idAppUser: this.props.idAppUser,
            page: page
        };
        var url = withParams(constants.BACKEND_URL + "/Shift/findAllByIdAppUserPaginated", params);
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
                            let fecha = moment(response.data.content[i].open,"YYYY-MM-DD[T]HH:mm:ss").format("YYYY-MM-DD");
                            let abrio = moment(response.data.content[i].open,"YYYY-MM-DD[T]HH:mm:ss").format("HH:mm:ss");
                            let cerro = response.data.content[i].close?
                                moment(response.data.content[i].close,"YYYY-MM-DD[T]HH:mm:ss").format("HH:mm:ss"):
                                "En curso";
                            let duration = parseFloat(response.data.content[i].duration);
                            let parcedDuration;
                            if(duration || duration === 0){
                                let minute = Math.floor(duration/60);
                                let hour = Math.floor(duration/60/60);
                                let second = Math.floor(duration%60);
                                parcedDuration = me.props.parseTime(hour,minute,second);
                            }else{
                                parcedDuration = "En curso";
                            }
                            response.data.content[i].open=abrio;
                            response.data.content[i].close=cerro;
                            response.data.content[i].time=fecha;
                            response.data.content[i].duration=parcedDuration;
                            response.data.content[i].cashClose= response.data.content[i].cashClose?
                                response.data.content[i].cashClose:"- o -";
                        }
                        console.log("updated shift data: ",prevState);
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
        this.props.history.push({
            pathname: "ShiftProfile",
            search: "?idShift=" + record.id
        })
    };

    parseTime = (h,m,s) => {
        let nh = h.toString();
        let nm = m.toString();
        let ns = s.toString();
        let ph = nh.length<2?"0"+nh:nh;
        let pm = nm.length<2?"0"+nm:nm;
        let ps = ns.length<2?"0"+ns:ns;
        return ph+":"+pm+":"+ps;
    };
    loadData=()=>{
        //console.log("Modules comming from redcuer: ",this.props.modules);
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params ={};
        let url = "";

        //console.log("Props received: ",this.props.idAppUser);
        if(this.props.idAppUser!==undefined){
            //console.log("Displaying the sales of especific user: ",this.props.idAppUser);
            params = {
                idAppUser:this.props.idAppUser
            };
            url = withParams(constants.BACKEND_URL+"/Shift/findAllByIdAppUserPaginated",params);
        }else{
            //console.log("Displaying the sales of company");
            params = {
                idCompany:this.props.idCompany
            };
            url = withParams(constants.BACKEND_URL+"/Shift/findAllByIdCompanyPaginated",params);
        }

        fetch(url, {
            method: "GET",
            headers: headers
        })
            .then(response => response.json())
            .then(function(response) {
                //console.log("Use data of SALES: ",data);
                for(let i in response.data){
                    response.data[i]["key"]=response.data[i]["id"];
                    let fecha = moment(response.data[i].open,"YYYY-MM-DD[T]HH:mm:ss").format("YYYY-MM-DD");
                    let abrio = moment(response.data[i].open,"YYYY-MM-DD[T]HH:mm:ss").format("HH:mm:ss");
                    let cerro = moment(response.data[i].close,"YYYY-MM-DD[T]HH:mm:ss").format("HH:mm:ss");
                    let duration = parseFloat(response.data[i].duration);
                    let minute = Math.floor(duration/60);
                    let hour = Math.floor(duration/60/60);
                    let second = Math.floor(duration%60);
                    console.log("duration: ",hour,":",minute,":",second);
                    let parcedDuration = me.parseTime(hour,minute,second);
                    response.data[i].open=abrio;
                    response.data[i].close=cerro;
                    response.data[i].time=fecha;
                    response.data[i].duration=parcedDuration;
                }
                console.log("data to be stored in shift table: ",response.data);
                me.setState({data:response.data});

                //console.log(futureColumns);
                //me.setState({columns:futureColumns});
            });
    };

    goToShiftProfile = idShift =>{
        //console.log("THIS APPUSER PROFILE: ",this);
        //this.setState({activeSubmenu:newActiveSubmenu});
        //console.log("GOING TO SUBMENU; ",idShift);
        //this.props.history.push(idAppUser.replace( /\s/g, '') );
        this.props.history.push({
            pathname: "ShiftProfile",
            search: "?idShift=" + idShift
        })
    };

    render() {
        //console.log("Props: ",this.props);
        return (
            <div style={{textAlign:"center"}}>
                <PaginatedLazyTable
                    idShift={this.props.idShift}
                    idAppUser={this.props.idAppUser}
                    columnDefs={this.state.columnDefs}
                    parseTime={this.parseTime}
                    loadTablePage={this.loadShiftTablePage}
                    length={this.props.shiftCount}
                    onRowClick={this.onRowClick}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { appUserReducer, moduleReducer } = state;
    const { idCompany, shiftCount} = appUserReducer;
    const { modules } = moduleReducer;
    //console.log("OWN PROPS OF MAKESTATE TO PROPS: ",ownProps);
    //console.log("idCompany for tableUser: ",idCompany);
    return {idCompany, modules, shiftCount};
};

export default withRouter(connect(mapStateToProps)(ShiftTable));
