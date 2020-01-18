import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Card } from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import "../../redux/reducers/appUserReducer"
import "../../stylesheets/views/shift/_shift.scss"
import {connect} from "react-redux";

const OpenShift= React.lazy(() => import("../../components/OpenShift/OpenShift"));
const CloseShift= React.lazy(() => import("../../components/CloseShift/CloseShift"));

class Shift extends Component {

    closeShift = () => {
        console.log("IDSHIFT TO DISPLAY CloseShift: ",this.props.idShift);
        //if(true){
        if(this.props.idShift !== undefined){
            return(
              <CloseShift/>
            );
        }
        return null;
    };

    render() {
        return (
            <div>
                <Card>
                    <OpenShift/>
                    <CloseShift/>
                </Card>
            </div>
        );
    };
}

const mapStateToProps = state => {
    const { appUserReducer } = state;
    const { idAppUser, idShift } = appUserReducer;
    console.log("idShift Received: ",idShift);
    return {idAppUser, idShift};
};

export default withRouter(connect(mapStateToProps)(Shift));
