import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {
	HomeOutlined,
	UserOutlined,
	TeamOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from "antd";
import {getCookie, withParams, getJWtProperty} from "../../utils.js";
import "antd/dist/antd.css";
import "./_Sidebar.scss";
import * as constants from "../../constants";

const {SubMenu} = Menu;
const {Sider} = Layout;

class Sidebar extends Component {
    state = {
        collapsed: false,
        moduleData: []
    };

    onCollapse = collapsed => {
        //console.log(collapsed);
        this.setState({collapsed});
    };

    componentDidMount = () => {

    };

    loadSidebarPermit = () => {
        //console.log("Fetching data");
        //console.log("+", getCookie("JWT"), "*");
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let params = {

        };
        let me = this;
        var url = withParams(constants.BACKEND_URL+"/module", params);
        fetch(url, {
            method: "GET",
            headers: headers
        })
            .then(response => response.json())
            .then(function (response) {
                if (response.success) {
	                me.setState({moduleData: response.data});
                }

            });
    };

     Logo = () => {
         return (
              <div>
                  <img
                       className = "logo"
                       alt = "TITAN"
                       src={require("../../assets/logos/logoHealth.png")}
                  />
              </div>
         );
     };

    render(){
        //onsole.log("WHole moduleData: ",this.state.moduleData);

        return(
            <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
                className={"sider"}
            >
                {
                	//this.Logo()
                }
	            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>

		            <Menu.Item key="2" icon={<UserOutlined />} onClick={() => this.props.handleActiveSubmenu("searchAppointment")}>
			            Mis consultas
		            </Menu.Item>
		            <Menu.Item key="3" icon={<TeamOutlined />} onClick={() => this.props.handleActiveSubmenu("appointment")}>
			            Consultas
		            </Menu.Item>
	            </Menu>
            </Sider>
        );
    }
}

export default  withRouter(Sidebar);
