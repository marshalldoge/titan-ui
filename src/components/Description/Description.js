import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col, Typography, Icon } from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import "../../redux/reducers/appUserReducer";
import "../../stylesheets/views/shift/_shift.scss";
import "./_Description.scss";

const { Title } = Typography;


class Description extends Component {


	render() {
		return (
			 <div className={"DescriptionCtn "+this.props.size}>
				 <Row>
					 <Col span={17}>
						 <Title level={3}>{this.props.person.fullName} <Icon type="edit" onClick={() => this.props.onEditClick(this.props.person)}/></Title>
					 </Col>
				 </Row>
				 <Row>
					 <Col span={8}>
						 <span className={"informationText"}>{this.props.person.cellphone}</span>
					 </Col>
					 <Col span={8}>
						 <span className={"informationText"}>{this.props.person.ci?this.props.person.ci:this.props.person.email}</span>
					 </Col>
					 <Col span={8}>
						 <span className={"informationText"}> {this.props.person.location}</span>
					 </Col>
				 </Row>
			 </div>
		);
	}
}

export default Description;
