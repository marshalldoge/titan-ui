import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col} from "antd";
import "antd/dist/antd.css";
import "../../redux/reducers/appUserReducer"
import {connect} from "react-redux";
import "./_Dashboard.scss";

const TTitle = React.lazy(() => import("../../components/TTitle/TTitle"));

class Dashboard extends Component {

    render() {
        return (
            <div className={"dashboardCtn"}>
				<Row>
					<Col span={24}>
					<TTitle
						label={"Dashboard"}
						 size={"big"}
					/>
					</Col>
				</Row>
	            <br/>
	            <Row type={"flex"}>
		            <Col span={12}>
			            <Row type={"flex"}>
				            <Col span={12}>
				            </Col>
				            <Col span={12}>
				            </Col>
			            </Row>
			            <Row type={"flex"}>
				            <Col span={12}>
				            </Col>
				            <Col span={12}>
				            </Col>
			            </Row>
		            </Col>
		            <Col span={12}>
			            <Row>
			            <TTitle
				             label={"Noticias"}
				             size={"big"}
			            />
			            </Row>
			            <Row>

			            </Row>
			            <Row>

			            </Row>

		            </Col>
	            </Row>
            </div>
        );
    };
}

const mapStateToProps = state => {
    const { appUserReducer } = state;
    const { idAppUser } = appUserReducer;
    return {idAppUser};
};

export default withRouter(connect(mapStateToProps)(Dashboard));
