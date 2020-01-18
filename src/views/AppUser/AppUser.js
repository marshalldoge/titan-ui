import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

const AppUserTable= React.lazy(() => import("../../components/AppUserTable/AppUserTable"));

class AppUser extends Component{

    componentDidMount() {
        //this.loadItemFields();
        //this.loadDestinationWarehouse();
    }

    render() {
        return (
            <div>
                <AppUserTable></AppUserTable>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { appUserReducer } = state;
    const { idAppUser } = appUserReducer;
    console.log("idAPPuser for news: ",idAppUser);
    return {idAppUser};
};

export default withRouter(connect(mapStateToProps)(AppUser));
