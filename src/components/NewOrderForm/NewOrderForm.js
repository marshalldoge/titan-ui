import React, {Component } from "react";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, Tooltip } from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
// routes config
import * as constants from "../../constants";
import {getCookie} from "../../utils";

const TTitle = React.lazy(() => import("../TTitle/TTitle"));

class NewOrderForm extends Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: []
    };

	goToOrder = () => {
		this.props.history.push("/Dashboard");
	};

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let me = this;
                //console.log("Received values of form: ", values);

                // Default options are marked with *
                var data = JSON.stringify({
	                itemDescription: values.itemDescription,
                    phone: values.phone,
	                clientName: values.firstName + " " +
		                 values.secondName + " " +
		                 values.secondName + " " +
		                 values.secondLastName,
	                price: Math.round(Math.random()*100+10 * 100) / 100

                });
                var url = constants.BACKEND_URL+"/Order";
                fetch(url, {
                    method: "POST",
                    body: data,
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
	                    "Authorization":getCookie("JWT")
                    }
                }).then(function (res) {
                    if (res.status == "200") {
                        console.log("Success");
                        me.goToOrder();
                        //var jwt = parseJwt(res.headers.get("Authorization"));
                        //var json=JSON.parse(jwt);

                    } else {
                        /*var ele = document.getElementById("mensaje");
                        var alerta = document.createElement("DIV");
                        alerta.className = "alert alert-danger";
                        alerta.innerHTML = "Su contraseña o usuario son incorrectos.";
                        console.log("Mostrando alerta: ", alerta);
                        ele.appendChild(alerta);
                    */
                    }
                });
            }
        });
    };


    render() {
        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16}
            }
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 16,
                    offset: 8
                }
            }
        };
        return (
	         <div>
		         <TTitle
			          label={"Nuevo pedido"}
			          size={"big"}
			          icon={"edit"}
		         />
	            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
	                <Form.Item
	                    label={
	                        <span>
	                            Primer Nombre&nbsp;
	                            <Tooltip title="Nombres del usuario">
	                                 <QuestionCircleOutlined />
	                            </Tooltip>
	                        </span>
	                    }
	                >
	                    {getFieldDecorator('firstName', {
	                        rules: [{required: true, message: 'Porfavor coloca el primer nombre.', whitespace: true}]
	                    })(<Input/>)}
	                </Form.Item>
	                <Form.Item
	                    label={
	                        <span>
	                            Segundo Nombre&nbsp;
	                            <Tooltip title="Nombres del usuario">
	                                 <QuestionCircleOutlined />
	                            </Tooltip>
	                        </span>
	                    }
	                >
	                    {getFieldDecorator('secondName', {
	                        rules: [{required: true, message: 'Porfavor coloca el segundo nombre.!', whitespace: true}]
	                    })(<Input/>)}
	                </Form.Item>
	                <Form.Item
	                    label={
	                        <span>
	                            Primer apellido&nbsp;
	                            <Tooltip title="Apellidos del usuario.">
	                                 <QuestionCircleOutlined />
	                            </Tooltip>
	                        </span>
	                    }
	                >
	                    {getFieldDecorator('lastName', {
	                        rules: [{required: true, message: 'Porfavor coloca el primer apellido!', whitespace: true}]
	                    })(<Input/>)}
	                </Form.Item>
	                <Form.Item
	                    label={
	                        <span>
	                            Segundo apellido&nbsp;
	                            <Tooltip title="Apellidos del usuario.">
	                                 <QuestionCircleOutlined />
	                            </Tooltip>
	                        </span>
	                    }
	                >
	                    {getFieldDecorator('secondLastName', {
	                        rules: [{required: true, message: 'Porfavor coloca el segundo apellido!', whitespace: true}]
	                    })(<Input/>)}
	                </Form.Item>
		            <Form.Item
			             label={
				             <span>
	                            Medicamento(s):&nbsp;
					             <Tooltip title="Medicamento para pedir">
	                                 <QuestionCircleOutlined />
	                            </Tooltip>
	                        </span>
			             }
		            >
			            {getFieldDecorator('itemDescription', {
				            rules: [{required: true, message: 'Pon un medicamento', whitespace: true}]
			            })(<Input/>)}
		            </Form.Item>
	                <Form.Item label="Numero Celular">
	                    {getFieldDecorator('phone', {
	                        rules: [{required: true, message: 'Pon un número!'}]
	                    })(<Input addonBefore={"591"} style={{width: '100%'}}/>)}
	                </Form.Item>
	                <Form.Item {...tailFormItemLayout}>
	                    <Button type="primary" htmlType="submit">
	                        Registrar
	                    </Button>
	                </Form.Item>
	            </Form>
	         </div>
        );
    }
}

const WNewUserForm = Form.create({name: 'Enviar'})(NewOrderForm);
export default WNewUserForm;
