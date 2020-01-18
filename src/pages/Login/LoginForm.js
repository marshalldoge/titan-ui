import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Form, Icon, Input, Button, Checkbox, Alert} from "antd";
import {setCookie, getJWtProperty} from "../../utils.js";

import "antd/dist/antd.css";
import "../../stylesheets/layout/_loginForm.scss";
import { connect } from "react-redux";
import { setIdAppUser } from "../../redux/actions";
import * as constants from "../../constants";


class LoginForm extends Component {

    state = {
      displayAlert:0
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let me = this;
                //console.log("Received values of form: ", values);
                var user = values.username;
                var password = values.password;
                // Default options are marked with *
                var data = JSON.stringify({
                    username: user,
                    password: password
                });
                var url = constants.BACKEND_URL+"/auth/login";
                fetch(url, {
                    method: "POST",
                    body: data,
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        console.log("Success");
                        //var jwt = parseJwt(res.headers.get("Authorization"));
                        //var json=JSON.parse(jwt);
                        setCookie("JWT", res.headers.get("Authorization"), 1);
                        const {from} = me.props.location.state || {from: {pathname: "/"}};
                        me.props.history.push(from);

                        //Updatign reducer
                        console.log("The app user is: ",getJWtProperty("idAppUser"));
                        me.props.setIdAppUser(getJWtProperty("idAppUser"));

                    } else {
                        me.setState({displayAlert:1});
                    }
                }).catch(error => {
                    me.setState({displayAlert:2});
                    console.log("Error: ", error);
                } );
            }
        });

    };

    signOut(e) {
        e.preventDefault();
        this.props.history.push("/");
    }

    alert = () => {
        if(this.state.displayAlert === 0)return null;
        let message;
        if(this.state.displayAlert === 1)message = "Usuario o Contraseña inválidos.";
        if(this.state.displayAlert === 2)message = "Hubo un problema de conexion. Verifique que esta conectado a internet.";
        return(
            <Form.Item>
                <Alert style={{

                }}
                       message={message}
                       type="error"
                />
            </Form.Item>
        );
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator("username", {
                            rules: [{required: true, message: "Please input your username!"}]
                        })(
                            <Input
                                prefix={<Icon type="user" style={{color: "rgba(0,0,0,.25)"}}/>}
                                placeholder="Username"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator("password", {
                            rules: [{required: true, message: "Please input your Password!"}]
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{color: "rgba(0,0,0,.25)"}}/>}
                                type="password"
                                placeholder="Password"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator("remember", {
                            valuePropName: "checked",
                            initialValue: true
                        })(<Checkbox>Remember me</Checkbox>)}
                        <Button type="link">Me olvide mi contraseña</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                        >
                            Log in
                        </Button>
                        Or <Button type="link">Registrese ahora!</Button>
                    </Form.Item>
                    {this.alert()}
                </Form>
            </div>
        );
    }
}
export default withRouter(connect(null,{setIdAppUser})(LoginForm))
