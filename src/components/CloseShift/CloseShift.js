import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Card, Input, Typography, Button } from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import "../../redux/reducers/appUserReducer"
import "../../stylesheets/views/shift/_shift.scss"
import {connect} from "react-redux";
import {getCookie, withParams} from "../../utils";
import * as constants from "../../constants";
import moment from "moment";
import {setIdShift, setShift, closeShift} from "../../redux/actions";

const { Title } = Typography;

class Shift extends Component {

    state = {
        cardDisplayed:"NULL",
        cashClose:0,
        open:null,
        close:null,
        now: moment()
    };

    componentDidMount() {
        if(this.props.inShift){
            //console.log("Currently in shift: ",this.props.idShift);
            this.setState({cardDisplayed:"DURING_SHIFT"});
        }
        this.runTime = setInterval(() => this.tick(),1000);
        this._isMounted = true;
    }

    tick = () => {
        if(this._isMounted) this.setState({now: moment()})
    };

    componentWillUnmount() {
        console.log("Clearing : ",this.runTime);
        clearInterval(this.runTime);
        this._isMounted = false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.inShift !== prevProps.inShift) {
            //console.log("Past idAppUser: ",prevProps.idAppUser," vs current: ",this.props.idAppUser);
            if(this.props.inShift) {
                this.setState({cardDisplayed:"DURING_SHIFT"});
            }else{
                this.setState({cardDisplayed:"NULL"});
            }
        }
    }

    showCardGridShiftClosed = () => {
        this.setState({cardDisplayed:"SHIFT_CLOSED"});
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
                me.setState({cardDisplayed:"NULL"});
            });
    };

    OpenCardTitle = () => {
        const isMobile = window.innerWidth < 480;
        const title = isMobile?"ABRIR":"ABRIR CAJA";
        return(
            <Title
                level={2}
                className={"cardTitle"}
                style={{
                    color:"white",
                    overflowX:"wrap",
                    marginBottom: "0px",
                    paddingBottom: "0px"
                }}
            >{title}</Title>
        );
    };

    onChange = e => {
        const { value } = e.target;
        this.setState({cashClose: value});
    };

    previousShiftAmount = () => {
        return (
            <div>
                <Title
                    level={4}
                    style={{
                        color:"white"
                    }}
                >Ultima Caja</Title>
                <span>
                <div style={{
                    color:"black"
                }
                }>
                    <span
                        style={{
                            background:"#eff4ff",
                            padding:"5px",
                            borderRadius:"3px"
                        }}
                    > {"121212 BS."}</span>
                </div>
                </span>
            </div>
        );
    };
    closeCash = () => {
        return (
            <div>
                <Title
                    level={4}
                    style={{
                        color:"white"
                    }}
                >Monto de cierre</Title>
                <span>
                <div style={{
                    color:"black"
                }
                }>
                    <span
                        style={{

                        }}
                    > <Input onChange={this.onChange} style={{width:"50%"}}/></span>
                </div>
                </span>
            </div>
        );
    };

    closedShiftMessage = () => {
        return(
            <Title level={1}>{"Has cerrado la caja."}</Title>
        );
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

    timeTitle = () => {
        return(
            <div>
                <Title style={{color:"white"}} level={3}>{
                    "Hora:"+this.state.now.format("hh:mm:ss")
                }</Title>
            </div>
        );
    };

    CardGridStyle = color => {
        return {
            background: color,
            color: "white",
            width: '100%',
            height: '260px',
            alignContent: "center"
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
            padding:"5px"
        };
    };

    CardMap = () => {
        //console.log("CardMap Displaying: ",this.state.cardDisplayed);
        switch (this.state.cardDisplayed) {
            case "SHIFT_CLOSED":
                return this.CardGridShiftClosed();
            case "DURING_SHIFT":
                return this.CardGridDuringShift();
            case "NULL":
                return null;
            default:
                return null;
        }
    };

    CardGridShiftClosed = () =>{
        return (
            <Card.Grid
                style={this.CardGridStyle("#7e3878")}
                onClick={this.showCardGridForm}
            >
                <Card title={this.OpenCardTitle()}
                      bordered={false}
                      style={this.CardStyle("#7e3878")}
                      headStyle={this.CardHeadStyle("#7e3878")}
                      bodyStyle={this.CardBodyStyle("#7e3878")}
                >
                    <div>
                        {this.closedShiftMessage()}
                    </div>
                </Card>
            </Card.Grid>
        );
    };
    CardGridDuringShift = () => {
        return (
            <Card.Grid
                style={this.CardGridStyle("#7e3878")}
            >
                <Card
                    title={this.timeTitle()}
                    bordered={false}
                    style={this.CardStyle("#7e3878")}
                    headStyle={this.CardHeadStyle("#7e3878")}
                    bodyStyle={this.CardBodyStyle("#7e3878")}
                >
                    <div>
                        {this.closeCash()}
                    </div>
                    <br/>
                    <div>
                        <Button type={"primary"} onClick={this.closeShift}>Cerrar caja</Button>
                    </div>
                </Card>
            </Card.Grid>
        );
    };

    render() {
        return this.CardMap();
    };
}

const mapStateToProps = state => {
    const { appUserReducer, shiftReducer } = state;
    const { idAppUser, idShift, inShift } = appUserReducer;
    const { open } = shiftReducer;

    return {idAppUser, idShift, open, inShift};
};

export default withRouter(connect(mapStateToProps,{ setIdShift, setShift, closeShift })(Shift));
