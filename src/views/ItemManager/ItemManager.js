import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Tabs} from "antd";
const { TabPane } = Tabs;

const ItemFileManager= React.lazy(() => import("../../components/ItemFileManager/ItemFileManager"));

class ItemManager extends Component{
    state={

    };

    callback = key => {
        console.log(key);
    };

    componentDidMount() {
        //this.loadItemFields();
        //this.loadDestinationWarehouse();
    }

    render() {
        return (
            <div>
                <div><h1>Agregar Productos</h1></div>
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                    <TabPane tab="Archivo" key="1">
                        <ItemFileManager></ItemFileManager>
                    </TabPane>
                    <TabPane tab="Manual" key="2">
                        Content of Tab Pane 2
                    </TabPane>
                    <TabPane tab="Administrar" key="3">
                        Content of Tab Pane 3
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
export default withRouter(ItemManager);
