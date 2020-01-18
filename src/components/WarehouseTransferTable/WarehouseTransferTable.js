import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import "antd/dist/antd.css";
import {getCookie, getJWtProperty} from "../../utils";
import "../../stylesheets/components/warehouseTransferTable/_warehouseTransferTable.scss";
import {BACKEND_URL} from "../../constants";

class WarehouseTransferTable extends Component {

    state={
        headers:["ID","Codigo","Nombre"],
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
        const url = BACKEND_URL + "Item/" + getJWtProperty("idOwner");
        fetch(url, {
            method: "GET",
            headers: headers
        })
            .then(response => response.json())
            .then(function (items) {
                console.log("Row Data: ", items);
                console.log("Use data: ", items);
                let futureData = [];
                for (let i in items) {
                    let item = items[i];
                    let parsedItem = {};
                    parsedItem["key"]=items[i]["id"];
                    for (let property in item) {
                        if (item.hasOwnProperty(property) && property !== "warehouseItemQuantities") {
                            parsedItem[property] = item[property];
                        }
                    }
                    for (let j in item["warehouseItemQuantities"]) {
                        let werehouseItemQuantity=item["warehouseItemQuantities"][j];
                        parsedItem[werehouseItemQuantity["idWarehouse"]]=werehouseItemQuantity["quantity"];
                    }
                    futureData.push(parsedItem);
                }
                console.log("PARSED DATA: ",futureData);

                me.setState({data: futureData});
            });
    }
    TableHead(){
        let row = this.state.headers.map((headerName,index) => <th className={`table-column ${index} ${headerName}`}>{headerName}</th>);
        let quantityField= (<th className={`table-column quantity`}>Cantidad</th>);
        let meassureField= (<th className={`table-column meassure`}>Medida</th>);
        return(
            <thead className="thead"><tr>{row}{quantityField}{meassureField}</tr></thead>
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

export default withRouter(WarehouseTransferTable);