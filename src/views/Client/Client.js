import React, {Component } from "react";
import {withRouter } from "react-router-dom";
const ClientTable= React.lazy(() => import("../../components/ClientTable/ClientTable"));

class Client extends Component{

    componentDidMount() {
        //this.loadItemFields();
        //this.loadDestinationWarehouse();
    }

    render() {
        return (
            <div>
                <ClientTable/>
            </div>
        );
    }
}
export default withRouter(Client);
