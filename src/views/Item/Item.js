import React, {Component } from "react";
import {withRouter} from "react-router-dom";
import {Row, Col} from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import {connect} from "react-redux";

const ItemStock= React.lazy(() => import("../../components/ItemStock/ItemStock"));
const Button= React.lazy(() => import("../../components/Button/Button"));

class Item extends Component {

    loadItemButton = () => {
        if(this.props.modules.Modules["Item"].actions["Create"]){
            return (
                 <Button
                      label={"Añadir Items"}
                      size={"small"}
                      onClick={this.goToItemManager}
                      type={"inverse"}
                 />
            );
        }else{
            return null;
        }
    };

    goToItemManager = () => {
        this.props.history.push("/ItemManager");
    };

    moveItemButton = () => {
        return (
             <Button
                  label={"Mover Items"}
                  size={"small"}
                  onClick={this.goToItemMoveManager}
                  type={"inverse"}
             />
        );
    };

    goToItemMoveManager = () => {
        this.props.history.push("/WarehouseItemQuantityTransfer");
    };

    render() {
        console.log("Props: ", this.props);
        return (
            <div>
                <ItemStock/>
                <br/>
                <Row type={"flex"} justify={"start"}>
                    <Col span={4}>
                        {this.loadItemButton()}
                    </Col>
                    <Col span={4}>
                        {this.moveItemButton()}
                    </Col>
                </Row>
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
