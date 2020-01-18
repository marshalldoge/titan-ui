import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Form } from "antd";

import "../../stylesheets/layout/_login.scss";


const LoginForm = React.lazy(() => import("./LoginForm"));

class Login extends Component {

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

  signOut(e) {
    e.preventDefault();
    this.props.history.push("/");
  }

  render() {
    return (
      <div className="app">
        <LoginForm form={this.props.form} />
      </div>
    );
  }
}

export default withRouter(Form.create()(Login));
