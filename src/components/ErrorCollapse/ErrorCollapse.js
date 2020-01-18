import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Collapse, Typography } from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import "../../redux/reducers/appUserReducer"
import {connect} from "react-redux";

const { Panel } = Collapse;
const [ Title ] = Typography;


class NewsFeed extends Component {

    state = {
      errors:[]
    };

    render() {
        return (
            <div>
                <Title level={2}>Solucionar inferencias</Title>
                <Collapse bordered={false} defaultActiveKey={['1']}>
                    <Panel header="This is panel header 1" key="1">
                        Error 1
                    </Panel>
                    <Panel header="This is panel header 2" key="2">
                        Error 2
                    </Panel>
                    <Panel header="This is panel header 3" key="3">
                        Error 3
                    </Panel>
                </Collapse>
            </div>
        );
    };
}

const mapStateToProps = state => {
    const { appUserReducer } = state;
    const { idAppUser } = appUserReducer;
    return {idAppUser};
};

export default withRouter(connect(mapStateToProps)(NewsFeed));
