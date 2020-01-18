import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import "antd/dist/antd.css";
import {getCookie } from "../../utils";
import "../../stylesheets/components/warehouseTransferTable/_warehouseTransferTable.scss";
import {BACKEND_URL} from "../../constants";

class SidebarPermitsTable extends Component {

    state={
        headers:["ID","Codigo"],
        data: []
    };

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        const url = BACKEND_URL + "Sidebar/all";
        fetch(url, {
            method: "GET",
            headers: headers
        })
            .then(response => response.json())
            .then(function (items) {
                console.log("Row Data: ", items);
                console.log("Use data: ", items);
                let futureData = items.sidebar;
                me.setState({data: futureData});
                console.log("DATA FOR SIDEBARPERMITTABLE: ",futureData);
            });
    };
    TableHead(){
        let row = this.state.headers.map((headerName,index) => <th className={`table-column ${index} ${headerName}`}>{headerName}</th>);
        let permit = (<th className={`table-column quantity`}>Permiso</th>);

        return(
            <thead className="thead"><tr>{row}{permit}</tr></thead>
        );
    }

    render() {
        return (
            <div>
                <table className="table">
                    {this.TableHead()}
                    <tbody className="ant-table-tbody">
                    <tr>
                        <td>Jill</td>
                        <td>Smith</td>
                        <td>50</td>
                    </tr>
                    <tr>
                        <td>Eve</td>
                        <td>Jackson</td>
                        <td>94</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default withRouter(SidebarPermitsTable);