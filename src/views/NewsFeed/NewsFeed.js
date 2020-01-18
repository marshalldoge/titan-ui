import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import "../../redux/reducers/appUserReducer"
import {connect} from "react-redux";

class NewsFeed extends Component {

    render() {
        return (
            <div>
                <h1>Bienvenido {this.props.idAppUser?this.props.idAppUser:"Usuario no indentificado. IP guardado para posterior investigacion."}</h1>
            </div>
        );
    };
}

const mapStateToProps = state => {
    const { appUserReducer } = state;
    const { idAppUser } = appUserReducer;
    return {idAppUser};
};

export default withRouter(connect(mapStateToProps)(NewsFeed));
