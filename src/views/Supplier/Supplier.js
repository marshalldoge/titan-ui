import React, {Component } from "react";
import {withRouter} from "react-router-dom";

const SupplierTable= React.lazy(() => import("../../components/SupplierTable/SupplierTable"));

class Supplier extends Component{

    componentDidMount() {
        //this.loadItemFields();
        //this.loadDestinationWarehouse();
    }

    render() {
        return (
            <div>
                <SupplierTable></SupplierTable>
            </div>
        );
    }
}
export default withRouter(Supplier);
