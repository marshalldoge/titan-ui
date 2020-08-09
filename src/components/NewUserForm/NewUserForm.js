import React, {Component } from "react";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, Tooltip } from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
// routes config
import * as constants from "../../constants";

class NewUserForm extends Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: []
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let me = this;
                //console.log("Received values of form: ", values);

                // Default options are marked with *
                var data = JSON.stringify({
                    username: values.username,
                    password: values.password,
                    email: values.email,
                    firstName: values.firstName,
                    secondName: values.secondName,
                    lastName: values.lastName,
                    secondLastName: values.secondLastName,
                    fullName: values.firstName + " " + values.lastName,
                    cellphone: values.cellphone,
                    location: values.location
                });
                var url = constants.BACKEND_URL+"/AppUser/sign-up";
                fetch(url, {
                    method: "POST",
                    body: data,
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(function (res) {
                    if (res.status == "200") {
                        console.log("Success");
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
                <Form.Item label="E-mail">
                    {getFieldDecorator('email', {
                        rules: [
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!'
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!'
                            }
                        ]
                    })(<Input/>)}
                </Form.Item>
                <Form.Item label="Contraseña" hasFeedback>
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your password!'
                            },
                            {
                                validator: this.validateToNextPassword
                            }
                        ]
                    })(<Input.Password/>)}
                </Form.Item>
                <Form.Item label="Confirme la contraseña" hasFeedback>
                    {getFieldDecorator('confirm', {
                        rules: [
                            {
                                required: true,
                                message: 'Please confirm your password!'
                            },
                            {
                                validator: this.compareToFirstPassword
                            }
                        ]
                    })(<Input.Password onBlur={this.handleConfirmBlur}/>)}
                </Form.Item>
                <Form.Item
                    label={
                        <span>
                            Nombre de usuario&nbsp;
                            <Tooltip title="What do you want others to call you?">
                                 <QuestionCircleOutlined />
                            </Tooltip>
                        </span>
                    }
                >
                    {getFieldDecorator('username', {
                        rules: [{required: true, message: 'Please input your nickname!', whitespace: true}]
                    })(<Input/>)}
                </Form.Item>
                <Form.Item label="Direccion">
                    {getFieldDecorator('location', {
                        initialValue:"",
                        rules: [
                            {required: false, message: 'Please select your habitual residence!', whitespace:true}
                        ]
                    })(<input/>)}
                </Form.Item>
                <Form.Item label="Numero Celular">
                    {getFieldDecorator('cellphone', {
                        rules: [{required: true, message: 'Please input your phone number!'}]
                    })(<Input addonBefore={"591"} style={{width: '100%'}}/>)}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Registrar
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const WNewUserForm = Form.create({name: 'Enviar'})(NewUserForm);
export default WNewUserForm;
