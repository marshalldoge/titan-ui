import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import PurchaseTable from "../../components/PurchaseTable/PurchaseTable";
import {Row, Col} from "antd";

const SaleTable= React.lazy(() => import("../../components/SaleTable/SaleTable"));
const TButton= React.lazy(() => import("../../components/TButton/TButton"));

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
            	 <TButton
		              onClick={this.goToPurchasemManager}
		              type={"inverse"}
		              label={"Realizar Compra"}
	             />
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
                    size={"small"}
                />
            );
        }
    };

    render() {
        return (
            <div>
	            <Row type={"flex"} justify={"end"} align={"middle"}>
		            <Col span={24}>
                        {this.AvailablePurchaseTable()}
		            </Col>
	            </Row>
                <br/>
                <Row type={"flex"} justify={"end"} align={"middle"}>
	                <Col span={6} style={{textAlign:"end"}}>
                        {this.loadItemButton()}
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
    console.log("idCompany for tableUser: ",idCompany);
    return {idCompany, idAppUser, modules};
};

export default withRouter(connect(mapStateToProps)(Purchase));
