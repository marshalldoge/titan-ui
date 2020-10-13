import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col, List, Typography, Button, Skeleton} from "antd";
import { MessageOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import "../../redux/reducers/appUserReducer"
import {connect} from "react-redux";
import "./_Dashboard.scss";

const TTitle = React.lazy(() => import("../../components/TTitle/TTitle"));
const MessageModal = React.lazy(() => import("../../components/MessageModal/MessageModal"));

class Dashboard extends Component {

	state = {
		isModalOpen: false,
		messageInformation: {}
	};

	openMessageModal = (e,item) => {
		console.log('Open message modal item: ',item);
		this.setState({
			isModalOpen: true,
			messageInformation: item
		});
	};

	messagesList = () => {
		let data = [];
		data.push({
			phone: "73567281",
			message: "Hola que tal :v"
		});
		data.push({
			phone: "73567281",
			message: "Hola que tal :v"
		});
		data.push({
			phone: "76533047",
			message: "Hola que tal :v"
		});
		return (
			 <List
				  header={<div>Menasajes recibidos</div>}
				  footer={<div>Octubre-2020</div>}
				  bordered
				  dataSource={data}
				  renderItem={item => (
					   <List.Item>
						   <Row justify="space-between" align="bottom" style={{width: '100%'}}>
							   <Col span={6}>
								   <Typography.Text mark>[{item.phone}]</Typography.Text>
							   </Col>
							   <Col span={12}>
								   {item.message}
							   </Col>
							   <Col span={3}>
								   <Button
									    type="primary"
									    shape="round"
									    icon={<MessageOutlined />}
									    size={'small'}
									    onClick={(e) => this.openMessageModal(e,item)}
								   />
							   </Col>
						   </Row>
					   </List.Item>
				  )}
			 />
		);
	};

    render() {
        return (
            <div className={"dashboardCtn"}>
				<Row>
					<Col span={24}>
					<TTitle
						label={"Notificaciones"}
						 size={"big"}
					/>
					</Col>
				</Row>
	            <br/>
	            <Row type={"flex"}>
		            <Col span={12}>
			            <Row>
				            <Col span={24}>
					            <TTitle
						             label={"Mensajes"}
						             size={"big"}
					            />
				            </Col>
			            </Row>
			            <Row type={"flex"}>
				            <Col span={20}>
					            {this.messagesList()}
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
	            <MessageModal
		             isOpen={this.state.isModalOpen}
		             messageInformation={this.state.messageInformation}
		             onClose={()=>this.setState({
			             isModalOpen: false
		             })}
	            />
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
