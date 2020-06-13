import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Layout, Menu, Icon} from "antd";
import {getCookie, withParams, getJWtProperty} from "../../utils.js";
import "antd/dist/antd.css";
import "./_Sidebar.scss";
import * as constants from "../../constants";

const {SubMenu} = Menu;
const {Sider} = Layout;

class Sidebar extends Component {
    state = {
        collapsed: false,
        menuData: []
    };

    onCollapse = collapsed => {
        //console.log(collapsed);
        this.setState({collapsed});
    };

    componentDidMount = () => {
        this.loadSidebarPermit();
    };

    loadSidebarPermit = () => {
        //console.log("Fetching data");
        //console.log("+", getCookie("JWT"), "*");
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let params = {
            idAppUser: getJWtProperty("idAppUser")
        };
        let me = this;
        var url = withParams(constants.BACKEND_URL+"/SidebarPermit", params);
        fetch(url, {
            method: "GET",
            headers: headers
        })
            .then(response => response.json())
            .then(function (data) {
                /*Example data:
                [
                        {
                                "menuItems": [
                                        "Por Cantidad",
                                        "Por Almacen"
                                ],
                                "logo": "dropbox",
                                "submenuTitle": "Productos"
                        },
                        {
                                "menuItems": [
                                        "Borrar"
                                ],
                                "logo": "user",
                                "submenuTitle": "Usuarios"
                        }
                ]
                */
                //console.log("Data for sidebar: ",data);
                me.setState({menuData: data});

                //console.log("data fro menu: ", me.state.menuData);
                //console.log("Data: ", data);
            });
    };

    SubMenu = (item) => {
        let menuItems=item["menuItems"].map(item => <Menu.Item key={item} onClick = {() => this.props.handleActiveSubmenu(item)}>{item}</Menu.Item>);
        //console.log("Item to be converted in Submenu: ",item," with Menuitems: ",menuItems);
        if(item["menuItemLength"] === 0){
            return (
                <Menu.Item
                    key={item["submenuTitle"]}
                    onClick={() =>
                        this.props.handleActiveSubmenu(item["name"])
                    }
                >
                    <
                        Icon
                        type={item["logo"]}
                    />
                    <span className="nav-text"> {item["submenuTitle"]} </span>
                </Menu.Item>
            );
        }else {
            return (
                <SubMenu
                    key={item["submenuTitle"]}
                    title={
                        <span>
                        <Icon
                            type={item["logo"]}
                        />
                        <span>{item["submenuTitle"]}</span>
                    </span>
                    }
                >
                    {menuItems}
                </SubMenu>
            );
        }
    };

     Menu = () =>{
         let SubMenus=this.state.menuData.map(item => this.SubMenu(item));
         return(<Menu theme="dark" mode="inline">{SubMenus}</Menu>);
     };

     Logo = () => {
         return null;
         return (
              <div>
                  <img
                       className = "logo"
                       alt = "SABONIS"
                       //src={require("../../assets/brandLogos/sabonis.jpg")}
                  />
              </div>
         );
     };

    render(){
        //onsole.log("WHole menuData: ",this.state.menuData);

        return(
            <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
                className={"sider"}
            >
                {this.Logo()}
                {this.Menu()}
            </Sider>
        );
    }
}

export default  withRouter(Sidebar);
