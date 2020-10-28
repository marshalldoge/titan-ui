import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col, List, Typography, Button, Skeleton} from "antd";
import Plot from 'react-plotly.js';
import { ResponsiveLine } from '@nivo/line'
import { MessageOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import "../../redux/reducers/appUserReducer"
import {connect} from "react-redux";
import "./_Dashboard.scss";
import * as mockData from './mockData';
import {getCookie, withParams} from "../../utils";
import {BACKEND_URL} from "../../constants";

const TTitle = React.lazy(() => import("../../components/TTitle/TTitle"));
const MessageModal = React.lazy(() => import("../../components/MessageModal/MessageModal"));

class Dashboard extends Component {

	state = {
		isModalOpen: false,
		messageInformation: {},
		monthData:[],
		monthIndicator: []
	};

	componentDidMount() {
		this.getMonthData();
	}

	openMessageModal = (e,item) => {
		console.log('Open message modal item: ',item);
		this.setState({
			isModalOpen: true,
			messageInformation: item
		});
	};

	getMonthData = () => {
		let me = this;
		let headers={
			"Content-Type": "application/json; charset=utf-8",
			"Authorization":getCookie("JWT")
		};
		let params = {
			month: 10
		};
		let url = withParams(BACKEND_URL+"/SMS/month",params);
		fetch(url, {
			method: "GET",
			body: this.state.file,
			headers: headers
		}).then(response => response.json())
			 .then(function (res) {
			 	if (res.success) {
		            me.setState(prevState => {
		            	let total = 0;
		            	for(let i = 0; i < res.data.length; i++) {
		            		total += res.data[i]["y"];
			            }
		            	prevState.monthIndicator = total;
		            	prevState.monthData = res.data;
		            	return prevState;
		            })
				} else {
					alert("Ha ocurrido un error cargando los datos del mes.");
				}
			}, function (e) {
				alert("Error submitting form!");
			});
	};

	messagesList = () => {
		let data = [];
		data.push({
			phone: "73567281",
			message: "Farmavir"
		});
		data.push({
			phone: "73567281",
			message: "Dipresol"
		});
		data.push({
			phone: "76533047",
			message: "Amoxinil"
		});
		return (
			 <List
				  header={<div>Mensajes</div>}
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

	MessageIndicators = () => {
		return (
			 <Plot
				  data={[
					  {
						  domain: { x: [0, 1], y: [0, 1] },
						  value: this.state.monthIndicator,
						  title: { text: "Mensajes" },
						  type: "indicator",
						  mode: "gauge+number",
						  delta: { reference: 200 },
						  gauge: { axis: { range: [0, 50] } }
					  }
				  ]}
				  layout={ {width: 400, height: 350} }
			 />
		)
	};

	MonthMessageLine = () => {
		const data = [{
			id: "Mensajes",
			color: "hsl(49, 70%, 50%)",
			data: this.state.monthData.map(item => {
				return {
					x: item["x"].split("-")[2],
					y: item["y"]
				}
			})
		}];

		console.log("Data to render",data);

		return (
			<ResponsiveLine
				 data={data}
				 margin={{top: 50, right: 110, bottom: 50, left: 60}}
				 xScale={{type: 'point'}}
				 yScale={{type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false}}
				 yFormat=" >-.2c"
				 axisTop={null}
				 axisRight={null}
				 colors={{ scheme: 'category10' }}
				 enablePoints={false}
				 axisBottom={{
					 orient: 'bottom',
					 tickSize: 5,
					 tickPadding: 5,
					 tickRotation: 0,
					 legend: 'Dias Octubre',
					 legendOffset: 36,
					 legendPosition: 'middle'
				 }}
				 axisLeft={{
					 orient: 'left',
					 tickSize: 5,
					 tickPadding: 5,
					 tickRotation: 0,
					 legend: 'Mensajes',
					 legendOffset: -40,
					 legendPosition: 'middle'
				 }}
				 pointSize={10}
				 pointColor={{theme: 'background'}}
				 pointBorderWidth={2}
				 pointBorderColor={{from: 'serieColor'}}
				 pointLabelYOffset={-12}
				 useMesh={true}
				 legends={[
					 {
						 anchor: 'bottom-right',
						 direction: 'column',
						 justify: false,
						 translateX: 100,
						 translateY: 0,
						 itemsSpacing: 0,
						 itemDirection: 'left-to-right',
						 itemWidth: 80,
						 itemHeight: 20,
						 itemOpacity: 0.75,
						 symbolSize: 12,
						 symbolShape: 'circle',
						 symbolBorderColor: 'rgba(0, 0, 0, .5)',
						 effects: [
							 {
								 on: 'hover',
								 style: {
									 itemBackground: 'rgba(0, 0, 0, .03)',
									 itemOpacity: 1
								 }
							 }
						 ]
					 }
				 ]}
			/>
		);
	};

    render() {
        return (
            <div className={"dashboardCtn"}>
				<Row>
					<Col span={24}>
					<TTitle
						label={"Gráficos"}
						 size={"big"}
					/>
					</Col>
				</Row>
	            <br/>
	            <Row type={"flex"}>
		            <Col span={8}>
			            <Row>
				            <Col span={24}>
					            <TTitle
						             label={"Indicadores"}
						             size={"big"}
					            />
				            </Col>
			            </Row>
			            <Row type={"flex"} className={"indicator-ctn"}>
				            <Col span={20}>
					            {this.MessageIndicators()}
				            </Col>
			            </Row>
			            <Row type={"flex"}>
				            <Col span={12}>
				            </Col>
				            <Col span={12}>
				            </Col>
			            </Row>
		            </Col>
		            <Col span={16}>
			            <Row>
			            <TTitle
				             label={"Linea de tiempo"}
				             size={"big"}
			            />
			            </Row>
			            <Row className={"graph-line-ctn"}>
				            {this.MonthMessageLine()}
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
