import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import PurchaseTable from "../../components/PurchaseTable/PurchaseTable";
import {Button} from "antd";

const SaleTable= React.lazy(() => import("../../components/SaleTable/SaleTable"));

class Purchase extends Component{

    state={

    };

    componentDidMount() {
        //this.loadItemFields();
        //this.loadDestinationWarehouse();
    }

    loadItemButton = () => {
        if(this.props.modules.Modules["Item"].actions["Create"]){
            //console.log("RENDERING BUTTON");
            return(
                <Button onClick={this.goToPurchasemManager} type="primary">Realizar Compra</Button>
            );
        }else{
            return null;
        }
    };

    goToPurchasemManager = () => {
        this.props.history.push("/PurchaseManager");
    };

    AvailablePurchaseTable = () => {
        console.log("Modules: ",this.props.modules);
        //TODO add purhcase model readAll action
        if(this.props.modules.Modules["Sale"].actions["ReadAll"]){
            console.log("Displaying all company purchases");
            return (
                <PurchaseTable
                    idCompany={this.props.idCompany}
                    filterModel={"company"}
                    pageSize={20}
                />
            );
        }else{
            console.log("Displaying sales of this user only");
            return (
                <PurchaseTable
                    idAppUser={this.props.idAppUser}
                    filterModel={"appUser"}
                    pageSize={20}
                />
            );
        }
    };

    render() {
        return (
            <div>
                {this.AvailablePurchaseTable()}
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
    console.log("idCompany for tableUser: ",idCompany);
    return {idCompany, idAppUser, modules};
};

export default withRouter(connect(mapStateToProps)(Purchase));
