import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col, Button } from "antd";
import { getCookie, withParams} from "../../utils.js";
import * as constants from "../../constants"
import {connect} from "react-redux";
import "antd/dist/antd.css";
import "./_SearchAppointmentTable.scss";
import {camelize, getDateFromLocalDateTime, getTimeIntervalFromLocalDateTime} from "../../utils";

const MessageModal = React.lazy(() => import("../../components/MessageModal/MessageModal"));
const PaginatedLazyTable= React.lazy(() => import("../../components/PaginatedLazyTable/PaginatedLazyTable"));

class SearchAppointmentTable extends Component {
	constructor(props) {
		super(props);
		this.sendMessage = this.sendMessage.bind(this);
	};
    // TODO Add Date of last sale to table
    state={
        columns: [],
        data: [],
        columnDefs: [
            {
            	headerName: "ID",
	            field: "id",
	            width: "5%"
            },
            {
            	headerName: "Nombre",
	            width: "30%",
	            render: function(item) {
		            return camelize(item.patient.appUser.firstName)+ " " + camelize(item.patient.appUser.lastName)
	            }
            },
            {
            	headerName: "CI",
	            field: "ci",
	            width: "15%",
	            render: function(item) {
		            return item.patient.appUser.ci
	            }
            },
            {
            	headerName: "Creación",
	            width: "25%",
	            render: function (item) {
		            return getDateFromLocalDateTime(item.creationTimeStamp)
	            }
            },
            {
            	headerName: "Última actualización",
	            width: "25%",
	            render: function (item) {
		            return getTimeIntervalFromLocalDateTime(item.lastUpateTimeStamp)
	            }
            },
        ],
        windowHeight: document.body.clientHeight,
	    isModalOpen: false,
	    messageInformation: {}
    };

    loadDoctorAppointmentsPage(page) {
        console.log("Loading page: ",page);
        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            page: page,
            pageSize: 25
        };

        const url = withParams(constants.BACKEND_URL + "/doctor/" + this.props.id + "/appointment/page", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
             .then(function (response) {
                 //console.log("me in getpage fetch is ",me);
                 if(response.success){
                     //console.log("Page data received: ",response);
                     me.setState ((prevState) =>{
                         prevState.pageData[page] =response.data.content;
                         return prevState;
                     });
                 }
             }).catch(function (error) {
            console.log(error);
        });
    };

	sendMessage(event, row){
		event.stopPropagation();
		console.log("Message sent with information; ",row);
		this.setState(prevState => {
			prevState.messageInformation = row;
			prevState.isModalOpen = true;
			return prevState;
		})
	}

	onRowClick = record => {
		//const idSale = record.id;
		console.log("Clicked row: ",record);
		this.props.history.push({
			pathname: "appointment_profile",
			search: "?appointmentId=" + record.id+"&patientId="+record.patient.id
		})
	};


    render() {
        return (
             <div>
	             {
		             //this.Search() TODO: For future tickets, add search bar
	             }
                 <PaginatedLazyTable
                      status={0}
                      columnDefs={this.state.columnDefs}
                      loadTablePage={this.loadDoctorAppointmentsPage}
                      length={this.props.clientCount}
                      title={"Consultas"}
                      pageSize={Math.floor(this.state.windowHeight/60)}
                      id={this.props.id}
                      onRowClick={this.onRowClick}
                 />
             </div>
        );
    }
}

const mapStateToProps = state => {
    const { appUserReducer, companyReducer } = state;
    const { id } = appUserReducer;
    console.log('DEBUG REDUCER: ',appUserReducer);
    return {id};
};

export default withRouter(connect(mapStateToProps)(SearchAppointmentTable));
