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
                    me.showCardGridDuringShift();
                    me.props.setIdShift(data);
                    data["open"]=timeOpened;
                    me.props.openShift(data);
                });
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
        this.setState({cashOpen: value});
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
                    > {this.props.cashClose}</span>
                </div>
                </span>
            </div>
        );
    };
    newShiftAmount = () => {
        return (
            <div>
                <Title
                    level={4}
                    style={{
                        color:"white"
                    }}
                >Nueva caja</Title>
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
        let now = this.state.now;
        let open = this.props.open;
        //console.log("open: ",open," to now: ",now);
        let diff = now.diff(open);
        //console.log("DIFF: ",diff);
        let duration = moment.duration(diff);
        let seconds =  duration.asSeconds();
        let minute = Math.floor(seconds/60);
        let hour = Math.floor(seconds/60/60);
        let second = Math.floor(seconds%60);
        return(
          <div>
              <Title style={{color:"white"}} level={3}>{
                  "Duracion de la caja:"
              }</Title>
              <Title style={{color:"white"}} level={3}>{
                  this.parseTime(hour,minute,second)
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
            alignItems:"center"
        };
    };

    CardMap = () => {
        //console.log("Displaying: ",this.state.cardDisplayed);
        switch (this.state.cardDisplayed) {
            case "NotOpened":
                return this.CardGridDefault();
            case "Form":
                return this.CardGridForm();
            case "Shift":
                return this.CardGridDuringShift();
            default:
                return null;
        }
    };

    CardGridDefault = () =>{
        return (
            <Card.Grid
                style={this.CardGridStyle("#2b5797")}
                onClick={this.showCardGridForm}
            >
                <Card title={this.OpenCardTitle()}
                      bordered={false}
                      style={this.CardStyle("#2b5797")}
                      headStyle={this.CardHeadStyle("#2b5797")}
                      bodyStyle={this.CardBodyStyle("#2b5797")}
                >
                    <div>
                        {this.previousShiftAmount()}
                    </div>
                </Card>
            </Card.Grid>
        );
    };
    CardGridForm = () => {
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
                        {this.previousShiftAmount()}
                        <br/>
                        {this.newShiftAmount()}
                        <br/>
                        <div>
                        <Button style={{
                            paddingLeft:"30px",
                            paddingRight:"30px"
                        }} type={"primary"} onClick={this.createShift}>Abrir</Button>
                            <span>   </span>
                        <Button type={"danger"} onClick={this.showCardGridDefault}>Cancelar</Button>
                        </div>
                    </div>
                </Card>
            </Card.Grid>
        );
    };
    CardGridDuringShift = () => {
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
                        {this.timeTitle()}
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
    const { idAppUser, idShift, idCompany, inShift } = appUserReducer;
    const { open, cashClose, saleCount } = shiftReducer;
    console.log("CloseChas: ",cashClose);
    return {idAppUser, idShift, open, cashClose, idCompany, inShift, saleCount};
};

export default withRouter(connect(mapStateToProps, {openShift, setIdShift})(Shift));
