import React, {Component } from "react";
import {withRouter} from "react-router-dom";
import {Table, Button} from "antd";
import {getCookie, getJWtProperty} from "../../utils.js";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import {BACKEND_URL} from "../../constants";
import {connect} from "react-redux";

const ItemStock= React.lazy(() => import("../../components/ItemStock/ItemStock"));

class Item extends Component {

    loadItemButton = () => {
        /*
        if(this.props.modules.Modules["Item"].actions["Create"]){
            //console.log("RENDERING BUTTON");
            return(
                <Button onClick={this.goToItemManager} type="primary">Añadir items(s)</Button>
            );
        }else{
            return null;
        }

         */
    };

    goToItemManager = () => {
        this.props.history.push("/ItemManager");
    };

    render() {
        console.log("Props: ", this.props);
        return (
            <div>
                <ItemStock/>
                <br/>
                {this.loadItemButton()}
            </div>
        );
    }
}
const mapStateToProps = state => {
    const { appUserReducer, moduleReducer } = state;
    const { idCompany, idAppUser} = appUserReducer;
    const { modules } = moduleReducer;
    console.log("Modules: ",modules);
    return {idCompany, idAppUser, modules};
};

export default withRouter(connect(mapStateToProps)(Item));
