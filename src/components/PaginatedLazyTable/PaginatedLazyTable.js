import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Pagination } from "antd";
import "antd/dist/antd.css";
import "../../redux/reducers/appUserReducer";
import "./_PaginatedLazyTable.scss";


class PaginatedLazyTable extends Component {

    //TODO add onHover effect to each row of table
    //TODO show an error message when the service fails
    constructor(props) {
        super(props);
        this.loadTablePage = this.props.loadTablePage.bind(this);
    };

    state = {
        fields: [],
        currentPage: 0,
        pageRange: {
            first: 0,
            last: 1
        },
        pageData:{
            0:[],
            1:[]
        }
    };

    componentDidMount() {
        for(let page=0;page<2;page++) {
            this.loadTablePage(page);
        }
    }

    thStyle = width => {
        return {
            width:width ,
            height:"40px"
        };
    };

    th = (field,index) => {
        return (
             <th key={index} style={this.thStyle(field.width)}>{field.headerName}</th>
        );
    };

    theadStyle = {
        background: "#fafafa"
    };

    thead = () => {
        let headers = this.props.columnDefs.map((field,index) => {
            return this.th(field, index)
        });
        return (
             <thead style={this.theadStyle}>
             <tr>
                 {headers}
             </tr>
             </thead>
        );
    };

    trStyle = {
        cursor:"pointer"
    };

    tr = (row,index) => {
        let tds = [];
        let fields = this.props.columnDefs.map(e => e.field);
        //console.log("tr fields: ",fields);
        //console.log("row: ",row);
        for(let i=0;i<fields.length;i++){
            tds.push(this.td(row[fields[i]],i,index%2===0?"white":"#ECEDF0"));
        }
        return(
             <tr className={"tr"} style = {this.trStyle} key={index} onClick={() => this.props.onRowClick(row)}>
                 {tds}
             </tr>
        );
    };

    trEmpty = (row,index) => {
        let tds = [];
        let fields = this.props.columnDefs.map(e => e.field);
        //console.log("tr fields: ",fields);
        //console.log("row: ",row);
        for(let i=0;i<fields.length;i++){
            tds.push(this.td(row[fields[i]],i,index%2===0?"white":"#ECEDF0"));
        }
        return(
             <tr key={index}>
                 {tds}
             </tr>
        );
    };

    tdStyle = background => {
        return {
            height: "30px",
            background:background
        };
    };

    td = (value,index,background) => {
        return(
             <td key={index} style={this.tdStyle(background)}>{value}</td>
        );
    };

    tableStyle = {
        background:"white",
        display:"inline-table",
        width: "100%"
    };

    titleStyles = {
        fontWeight: '500',
        fontSize: '25px'
    };

    title = () => {
        let titleText = this.props.title;
        if(titleText){
            return (
                 <h1 style={this.titleStyles}>{titleText}</h1>
            );
        }else{
            return null;
        }
    };

    table = () =>{
        return (
             <table style={this.tableStyle}>
                 {this.thead()}
                 {this.tbody()}
             </table>
        );
    };

    tbody = () => {
        let rowData = this.state.pageData[this.state.currentPage].map((row,index) => this.tr(row,index));
        console.log("Page size of table: ",this.props.pageSize);

        //This is to print white and gray empty lines
        let emptyObject = {};
        for(let i = 0; i < this.props.columnDefs.length; i++) {
            emptyObject[this.props.columnDefs[i]['field']] = '';
        }
        console.log("Empty object for table: ",emptyObject);
        for(let i = rowData.length;i < this.props.pageSize; i++) {
            rowData.push(this.trEmpty(emptyObject,i));
        }

        return(
             <tbody>
             {rowData}
             </tbody>
        );
    };

    pagination = () => {
        console.log("total for pagination: ",this.props.length);
        return(
             <Pagination
                  current={this.state.currentPage+1}
                  onChange={this.onChange}
                  total={this.props.length}
                  pageSize={this.props.pageSize?this.props.pageSize:10}
             />
        );
    };

    onChange = page => {
        //console.log("OnChange: State data: ",page);
        if(page>this.state.currentPage){
            //console.log("loading next page:");
            this.loadTablePage(this.state.pageRange.last+1);
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

    tableContainerStyle = {
        height: Math.max(((this.props.pageSize*30)+40),190).toString()+"px",
        background:"white",
        textAlign:"center"
    };

    render() {
        return (
             <div>
                 {this.title()}
                 <div style={this.tableContainerStyle}>
                     {this.table()}
                 </div>
                 <br/>
                 {this.pagination()}
             </div>
        );
    };
}

export default withRouter(PaginatedLazyTable);
