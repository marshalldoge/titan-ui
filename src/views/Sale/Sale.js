import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

const SaleTable= React.lazy(() => import("../../components/SaleTable/SaleTable"));

class Sale extends Component{

    state={

    };

    componentDidMount() {
        //this.loadItemFields();
        //this.loadDestinationWarehouse();
    }

    AvailableSaleTable = () => {
        console.log("Modules: ",this.props.modules);
        if(this.props.modules.Modules["Sale"].actions["ReadAll"]){
            console.log("Displaying all company sales");
            return (
                <SaleTable
                    idCompany={this.props.idCompany}
                    filterModel={"company"}
                    pageSize={20}
                />
            );
        }else{
            console.log("Displaying sales of this user only");
            return (
                <SaleTable
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
                {this.AvailableSaleTable()}
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

export default withRouter(connect(mapStateToProps)(Sale));
