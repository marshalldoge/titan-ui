import React, { Component} from "react";
import { withRouter} from "react-router-dom";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, Select } from "antd";
import { getCookie} from "../../utils.js";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import {withParams} from "../../utils";
import {connect} from "react-redux";
import * as constants from "../../constants";
import {BACKEND_URL} from "../../constants";

const { Option } = Select;
const { TextArea } = Input;

class PurchaseFileManager extends Component {

    state = {
        formLayout: 'horizontal',
        selected:"",
        defaultValue: "",
        selectOptions: [],
        warehouseMap:{},
        file:undefined,
        disabledButton: true
    };

    handleFormLayoutChange = e => {
        this.setState({ formLayout: e.target.value });
    };

    componentDidMount() {
        this.loadSelectOptions();
    }

    handleSubmit = files => {
        let formData  = new FormData();
        formData.append("file",files[0]);
        let headers={
            "Authorization":getCookie("JWT")
        };
        let params = {
            idWarehouse:this.state.warehouseMap[this.state.selected],
            idActiom:this.state
        };
        let url = withParams(BACKEND_URL+"/XLSXDocument",params);
        fetch(url, {
            method: "POST",
            body: this.state.file,
            headers: headers
        }).then(function (res) {
            if (res.ok) {
                alert("El archivo se ha subido correctamente. ");
            } else if (res.status === 401) {
                alert("Oops! ");
            }
        }, function (e) {
            alert("Error submitting form!");
        });
    };

    handleChange = (value) => {
        this.setState({selected:value},this.checkForm);
        console.log(`selected ${value}`);
    };

    updateFilesSelected = e => {
        let formData  = new FormData();
        formData.append("file",e.target.files[0]);
        this.setState({file:formData},this.checkForm);
        console.log("Files updated: ",e.target.files);
        console.log("FILE 0: ",e.target.files[0]);
    };

    loadSelectOptions = () => {
        let headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idCompany:this.props.idCompany
        };
        let url = withParams(constants.BACKEND_URL+"/Warehouse/findAllByIdCompany",params);
        fetch(url, {
            method: "GET",
            headers: headers
        })
            .then(response => response.json())
            .then(function(data) {
                console.log("Data comming from the WAREHOUSE service: ",data);

                let map={};
                for(let i=0;i<data.length;i++){
                    map[data[i].name]=data[i].id;
                }

                me.setState(
                    {
                        selectOptions : data,
                        defaultValue : data[0].name,
                        warehouseMap: map
                    });
                me.getSelectOptions();

                //console.log(futureColumns);
                //me.setState({columns:futureColumns});
            });
    };

    getSelectOptions = () => {
        let aux = this.state.selectOptions;
        console.log("aux: ",aux);
        let options = this.state.selectOptions.map(option => <Option key={option.id} value={option.name}>{option.name}</Option>);
        console.log("Formated options",options);
        return options;
    };

    checkForm = () => {
        if(this.state.selected === "" || this.state.file === undefined){
            this.setState({
                disabledButton:true
            });
        }else{
            this.setState({
                disabledButton:false
            });
        }
    };

    render() {
        console.log("Props: ",this.props);
        const { formLayout } = this.state;
        const formItemLayout =
            formLayout === 'horizontal'
                ? {
                    labelCol: { span: 3 },
                    wrapperCol: { span: 12 },
                }
                : null;
        return (
            <div>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>

                    <Form.Item label="Nota:" {...formItemLayout}>
                        <TextArea rows={2} />
                    </Form.Item>
                    <Select
                        placeholder= {"Almacen donde guardar los items"}
                        defaultActiveFirstOption={false}
                        defaultValue={this.state.defaultValue?this.state.defaultValue:""}
                        size={'default'}
                        onChange={this.handleChange}
                    >
                        {this.getSelectOptions()}
                    </Select>
                </Form>
                <br/>
                <input type="file" onChange={this.updateFilesSelected}/>
                <Button type="primary" onClick={e => this.handleSubmit(e.target)} disabled={this.state.disabledButton}>
                    Subir archivo
                </Button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { appUserReducer } = state;
    const { idCompany } = appUserReducer;
    console.log("idCompany for tableUser: ",idCompany);
    return {idCompany};
};

const WItemFileManager = Form.create({ name: 'Enviar' })(PurchaseFileManager);
export default withRouter(connect(mapStateToProps)(WItemFileManager));

