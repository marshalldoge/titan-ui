import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Tabs} from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";

const SidebarPermitsTable = React.lazy(() => import("./SidebarPermitsTable"));
const { TabPane } = Tabs;

class Permits extends Component {

    render() {
        console.log("Props: ",this.props);
        return (
            <div>
                <h1>Este es el panel de permisos</h1>
                <Tabs tabPosition={"left"}>
                    <TabPane tab="Sidebar" key="1">
                        <SidebarPermitsTable/>
                    </TabPane>
                    <TabPane tab="Tab 2" key="2">
                        Other stuff
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default withRouter(Permits);
