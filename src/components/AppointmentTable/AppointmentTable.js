import React, { Component} from "react";
import { withRouter} from "react-router-dom";
import { Row, Col, Pagination, Drawer, Image, Input, Collapse,List } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { getCookie, withParams, getAge} from "../../utils.js";
import * as constants from "../../constants"
import {connect} from "react-redux";
import "antd/dist/antd.css";
import "../../redux/reducers/moduleReducer";
import "./_AppointmentTable.scss";
import TTitle from "../TTitle/TTitle";
import Gallery from "react-photo-gallery";

const { Search } = Input;
const { ListItem } = List;
const { Panel } = Collapse;
const TButton = React.lazy(() => import("../TButton/TButton"));
const Title = React.lazy(() => import("../TTitle/TTitle"));

class AppointmentTable extends Component {

	state={
		itemData:[],
		pageData:{
			0:[],
			1:[]
		},
		pageRange: {
			first: 0,
			last: 1
		},
		currentPage:0,
		pageSize: 15,
		isDrawerOpen: false,
		drawerAppointmentData: null,
		drawerMedia: [
			{
				src: "https://mejorconsalud.com/wp-content/uploads/2014/02/moreton-hematoma-rodilla-470x313.jpg",
				width: 4,
				height: 3
			},
			{
				src: "https://hdstatic.net/gridfs/holadoctor/53602d6bb937955142fe44e2_0_7-1571840563,231.jpg",
				width: 1,
				height: 1
			},
			{
				src: "https://us.123rf.com/450wm/bankrx/bankrx1703/bankrx170300212/74107080-hematoma-de-color-marrón-en-el-fondo-de-la-rodilla-mujer.jpg?ver=6",
				width: 1,
				height: 1
			},
			{
				src: "https://img.saludsavia.com/wp-content/uploads/2019/04/Hematomas-300x200.jpg",
				width: 1,
				height: 1
			}
		],
		searchValue: ""
	};

	componentDidMount() {
		this.getInitialPages("");
	}

	getInitialPages = searchValue => {
		for(let i=0;i<2;i++){
			this.getPage(i,searchValue);
		}
	};

	getPage = (page,searchValue) => {
		//console.log("sale tale props: ",this.props);
		//console.log("Loading page: ",page);
		var headers = {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: getCookie("JWT")
		};
		let me = this;
		let params = {
			page: page,
			pageSize: this.state.pageSize,
			status: 0, //Status 0 means that open appointments
			searchValue: searchValue
		};
		let url = withParams(constants.BACKEND_URL + "/appointment/status/page", params);
		fetch(url, {
			method: "GET",
			headers: headers
		}).then(response => response.json())
			 .then(function (response) {
				 //console.log("me in getpage fetch is ",me);
				 if(response.data === null) response.data = {
					 content: []
				 };
				 if(response.success){
					 //console.log("Page data received: ",response);
					 me.setState ((prevState) =>{
						 prevState.pageData[page] = response.data.content;
						 return prevState;
					 });
				 }
			 }).catch(function (error) {
			console.log(error);
		});
	};

	addDoctorToAppt = (appt) => {
		//console.log("sale tale props: ",this.props);
		//console.log("Loading page: ",page);
		var headers = {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: getCookie("JWT")
		};
		console.log('props: ',this.props);
		let body = JSON.stringify(
			 [
				 {
				 	id: this.props.id
				 }
			 ]);
		console.log('Body: ',body);
		let me = this;
		let url = constants.BACKEND_URL + "/doctor/appointment/"+appt.id;
		fetch(url, {
			method: "PUT",
			headers: headers,
			body: body
		}).then(response => response.json())
			 .then(function (response) {
				 if(response.success){
					 me.props.history.push({
						 pathname: "appointment_profile",
						 search: "?appointmentId=" + appt.id+"&patientId="+appt.patient.id
					 })
				 }
			 }).catch(function (error) {
			console.log(error);
		});
	};


	Title = () => {
		return (
			 <Title
				  label={"Consultas"}
				  size={"big"}
			 />
		);
	};

	openApptDrawer = (e, record) => {
		//const idSale = record.id;
		console.log("Clicked row: ",record);
		//TODO add an Item Profile so you can enter it by this component
		/*
		this.props.history.push({
			pathname: "ItemProfile",
			search: "?idItem=" + idItem
		})
		 */
		this.setState(prevState => {
			prevState.drawerAppointmentData = record;
			prevState.isDrawerOpen = true;
			return prevState;
		})
	};

	onTakeAppointment = (e,appt) => {
		this.addDoctorToAppt(appt);
	};


	ApptDescription = () => {
		return (
			 <div className={"appt-description"}>
				 {
				    "El anterior viernes sufi una caida en la calle. No sentí nada en ese momento, pero dias despues me empexó a dolor la espalda."
				 }
			 </div>
		);
	};

	ItemBox = (appt,index) => {
		return(
			 <div className={"itemBox"} key={index}>
				 <Row className={"itembox-fields-ctn"}>
					 <Col span={18}>
						 <Row>
							 <Col span={8}>
								 {this.FieldValue("Nombre: ",appt.patient.appUser.firstName+" "+appt.patient.appUser.lastName)}
							 </Col>
							 <Col span={8}>
								 {this.FieldValue("Género: ","Masculino")}
							 </Col>
							 <Col span={8}>
								 {this.FieldValue("Edad: ","24")}
							 </Col>
						 </Row>
					 </Col>
					 <Col span={6}>
						 <Row align={"center"}>
							 <TButton
								  type={"inverse"}
								  label={"Ver más"}
								  size={"small"}
								  inverse={true}
								  onClick={(e) => this.openApptDrawer(e,appt)}
							 />
						 </Row>
					 </Col>
				 </Row>
				 <Row className={"text-buttons-ctn"}>
					 <Col span={18}>
						 {this.ApptDescription()}
					 </Col>
					 <Col span={6} style={{marginTop: 10}}>
						 <Row align="bottom">
							 <Col span={24}>
								 <TButton
									  type={"inverse"}
									  label={"Remitir"}
									  size={"expanded"}
									  inverse={true}
								 />
							 </Col>
						 </Row>
						 <br />
						 <Row>
							 <Col span={24}>
								 <TButton
									  type={"inverse"}
									  label={"Atender"}
									  size={"expanded"}
									  inverse={true}
									  onClick={e => this.onTakeAppointment(e,appt)}
								 />
							 </Col>
						 </Row>
					 </Col>
				 </Row>
			 </div>
		);
	};

	Search = () => {
		return (
			 <Search
				  placeholder="Búsca por el nombre"
				  onSearch={value => this.getInitialPages(value)}
				  style={{ width: 400 }}
			 />
		);
	};

	Container = () => {
		let boxes = this.state.pageData[this.state.currentPage].map((item,index) => this.ItemBox(item,index));
		return (
			 <div className={"itemCtn"}>
				 {boxes}
			 </div>
		);
	};

	pagination = () => {
		return(
			 <Pagination
				  current={this.state.currentPage+1}
				  onChange={this.onChange}
				  total={10}
				  pageSize={this.state.pageSize}
			 />
		);
	};

	onChange = page => {
		//console.log("OnChange: State data: ",page);
		if(page>this.state.currentPage){
			//console.log("loading next page:");
			this.getPage(this.state.pageRange.last+1);
			this.setState(state => {
				let pageRange = state.pageRange;
				pageRange.last=pageRange.last+1;
				return {
					pageRange:pageRange
				}
			});
		}else{
			//Not erasing data, so this is not necesary yet.
			//this.props.loadSaleTablePage(this.state.pageRange.first-1);
		}
		console.log("Showing page: ",page-1);
		this.setState({
			currentPage: page-1,
		});
	};

	DrawerMedia = () => {
		let media = this.state.drawerMedia.map((url,idx) => {
			return (
				 <Col span={10} key={idx}>
					 <Image
						  key={idx}
						  width={240}
						  src={url}
						  className={"drawer-media"}
					 />
				 </Col>
			);
		});
		let rows = [];
		let mediaLeft = 0;
		for(let i = 0; i < 2; i+=2) {

		}
		return (
			 <Row justify="space-around">
				 {media}
			 </Row>
		);
	};

	imageRenderer = ({ index, left, top, key, photo }) => {
		return (
			 <Image
				  key={index}
				  {...photo}
				  className={"drawer-media"}
			 />
		);
	};

	FieldValue = (name, value) => {
		return (
			 <Row>
				 <Col span={8} className={"field-name"}>
					 {name}
				 </Col>
				 <Col span={16}>
					 {value}
				 </Col>
			 </Row>
		);
	};


	Drawer = () => {
		if(this.state.drawerAppointmentData === null) return null;
		const allergies = this.state.drawerAppointmentData.patient.allergies.map(allergy => {
			return allergy.name;
		});
		const medications = this.state.drawerAppointmentData.patient.medications.map(medication => {
			return medication.name;
		});
		const substances = this.state.drawerAppointmentData.patient.substances.map(substance => {
			return substance.name;
		});
		const diseases = this.state.drawerAppointmentData.patient.diseases.map(disease => {
			return disease.name;
		});

		console.log('this.state.drawerAppointmentData: ',this.state.drawerAppointmentData);


		return (
			 <Drawer
				  placement="right"
				  closable={true}
				  onClose={()=>this.setState({isDrawerOpen: false})}
				  visible={this.state.isDrawerOpen}
				  width={600}
			 >
				 <TTitle
					  label={"Información adicional"}
					  size={"medium"}
				 />
				 <Row className={"vehicle-box-row"}>
					 <Col span={8}>
						 {this.FieldValue("Nombre: ",
							  this.state.drawerAppointmentData.patient.appUser.firstName +
							  " " +
							  this.state.drawerAppointmentData.patient.appUser.lastName
						 )}
					 </Col>
					 <Col span={8}>
						 {this.FieldValue("Género: ",this.state.drawerAppointmentData.patient.appUser.genre)}
					 </Col>
					 <Col span={8}>
						 {this.FieldValue("Edad: ",getAge(this.state.drawerAppointmentData.patient.appUser.birthDate))}
					 </Col>
				 </Row>
				 <Row className={"this.state.drawerVehicleData-box-row"}>
					 <Col span={7}>
						 {this.FieldValue("Altura: ",this.state.drawerAppointmentData.patient.appUser.height)}
					 </Col>
					 <Col span={8}>
						 {this.FieldValue("Peso: ",this.state.drawerAppointmentData.patient.appUser.weight)}
					 </Col>
					 <Col span={9}>
						 {this.FieldValue("Celular: ",this.state.drawerAppointmentData.patient.appUser.phone)}
					 </Col>
				 </Row>
				 <br/>
				 <Row>
					 <TTitle
						  label={"Detalles"}
						  size={"medium"}
					 />
					 <br/>
					 <Col span={24}>
						 <Collapse>
							 <Panel header="Alergias" key="1" disabled={allergies.length === 0}>
								 <List
									  size="small"
									  bordered
									  dataSource={allergies}
									  renderItem={item => <List.Item>{item}</List.Item>}
								 />
							 </Panel>
							 <Panel header="Medicamentos" key="2" disabled={medications.length === 0}>
								 <List
									  size="small"
									  bordered
									  dataSource={medications}
									  renderItem={item => <List.Item>{item}</List.Item>}
								 />
							 </Panel>
							 <Panel header="Substancias" key="3" disabled={substances.length === 0}>
								 <List
									  size="small"
									  bordered
									  dataSource={substances}
									  renderItem={item => <List.Item>{item}</List.Item>}
								 />
							 </Panel>
							 <Panel header="Enfermadades" key="4" disabled={diseases.length === 0}>
								 <List
									  size="small"
									  bordered
									  dataSource={diseases}
									  renderItem={item => <List.Item>{item}</List.Item>}
								 />
							 </Panel>
						 </Collapse>
					 </Col>
				 </Row>
				 <br/>
				 <Row justify="space-between">
					 <Col span={6}>
						 <TTitle
							  label={"Media"}
							  size={"medium"}
						 />
					 </Col>
					 <Col span={6}>

					 </Col>
				 </Row>
				 <br/>
				 <Row>
					 <Col span={24}>
						 <Gallery photos={this.state.drawerMedia} renderImage={this.imageRenderer}  />
					 </Col>
				 </Row>
			 </Drawer>
		)
	};


	render() {
		return (
			 <React.Fragment>
				 {this.Title()}
				 {
				 	//this.Search() TODO: For future tickets, add search bar
				 }
				 <br/>
				 <br/>
				 {this.Container()}
				 <br/>
				 {this.pagination()}
				 {this.Drawer()}
			 </React.Fragment>
		);
	}
}

const mapStateToProps = state => {
	const { appUserReducer } = state;
	const { appUser, appointments, id } = appUserReducer;
	console.log('DEGUB APP_REDUCER: ',appUserReducer);
	return {appUser, appointments, id};
};

export default withRouter(connect(mapStateToProps)(AppointmentTable));
