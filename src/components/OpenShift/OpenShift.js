import React, { Component } from "react";
import { withRouter} from "react-router-dom";
import { Card, Input, Typography, Button } from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import "../../redux/reducers/appUserReducer"
import "../../stylesheets/views/shift/_shift.scss"
import {connect} from "react-redux";
import {getCookie, withParams} from "../../utils";
import * as constants from "../../constants";
import moment from "moment";
import {openShift, setIdShift} from "../../redux/actions";

const { Title } = Typography;

class Shift extends Component {

    _isMounted = false;

    state = {
        cardDisplayed:"NotOpened",
        cashOpen:0,
        open:null,
        close:null,
        now: moment()
    };

    componentDidMount() {
        console.log("componentDidMount openShift: ",this.props.idShift, "but inShift: ",this.props.inShift);
        if(this.props.inShift) {
            this.setState({cardDisplayed: "Shift"});
        }else{
            this.setState({cardDisplayed: "NotOpened"});
        }
        this.runTime = setInterval(() => this.tick(),1000);
        this._isMounted = true;
    }

    tick = () => {
        if(this._isMounted) this.setState({now: moment()})
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.inShift !== prevProps.inShift) {
            console.log("Past idShift: ",prevProps.inShift," vs current: ",this.props.inShift);
            if(this.props.inShift) {
                this.setState({cardDisplayed: "Shift"});
            }else{
                this.setState({cardDisplayed: "NotOpened"});
            }
        }
    }
    componentWillUnmount() {
        console.log("Clearing : ",this.runTime);
        clearInterval(this.runTime);
        this._isMounted = false;
    }

    showCardGridDefault = () => {
        //console.log("Starting shift");
        this.setState({cardDisplayed:"NotOpened"});
    };
    showCardGridForm = () => {
        this.setState({cardDisplayed:"Form"});
    };
    showCardGridDuringShift = () => {
        this.setState({cardDisplayed:"Shift"});
    };

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
        let url = withParams(constants.BACKEND_URL+"/Shift", params);
        fetch(url, {
            method: "POST",
            headers: headers,
            body: body
        })
            .then(response => response.json())
            .then(function (data) {
                console.log("Shift created and retrieved forn database: ",data);
                me.setState({open:timeOpened},() =>{
                    me.showCardGridDuringShift();
                    me.props.setIdShift(data);
                    data["open"]=timeOpened;
                    me.props.openShift(data);
                });
            });
    };

    render() {
        return this.CardMap();
    };
}

const mapStateToProps = state => {
    const { appUserReducer, shiftReducer } = state;
    const { idAppUser, idShift, idCompany, inShift } = appUserReducer;
    const { open, cashClose, saleCount } = shiftReducer;
    console.log("CloseChas: ",cashClose);
    return {idAppUser, idShift, open, cashClose, idCompany, inShift, saleCount};
};

export default withRouter(connect(mapStateToProps, {openShift, setIdShift})(Shift));
