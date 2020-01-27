import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Col, Row} from "antd";

const AppUserTable= React.lazy(() => import("../../components/AppUserTable/AppUserTable"));
const Button= React.lazy(() => import("../../components/Button/Button"));

class AppUser extends Component{

    componentDidMount() {
        //this.loadItemFields();
        //this.loadDestinationWarehouse();
    }

    addNewUserButton = () => {
        console.log("Props: ",this.props.modules);
        if(this.props.modules.Modules["AppUser"].actions["Create"]){
            return (
                 <Button
                      label={"Añadir Usuarios"}
                      size={"small"}
                      onClick={this.goToAppUserForm}
                      type={"inverse"}
                 />
            );
        }else{
            return null;
        }
    };

    goToAppUserForm = () => {
        this.props.history.push("/AppUserForm");
    };

    render() {
        return (
            <div>
                <AppUserTable></AppUserTable>
                <Row type="flex" justify="end">
                    <Col span={8} style={{textAlign:"end"}}>
                        {this.addNewUserButton()}
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { appUserReducer, moduleReducer } = state;
    const { idAppUser } = appUserReducer;
    const { modules } = moduleReducer;
    return {idAppUser, modules};
};

export default withRouter(connect(mapStateToProps)(AppUser));
