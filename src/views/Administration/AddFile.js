import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { getCookie} from "../../utils.js";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import {BACKEND_URL} from "../../constants";

class AddFile extends Component {

    handleChange = files => {
        let formData  = new FormData();
        formData.append("file",files[0]);
        let headers={
            "Authorization":getCookie("JWT")
        };
        fetch(BACKEND_URL+"/XLSXDocument", {
            method: "POST",
            body: formData,
            headers: headers
        }).then(function (res) {
            if (res.ok) {
                alert("Perfect! ");
            } else if (res.status === 401) {
                alert("Oops! ");
            }
        }, function (e) {
            alert("Error submitting form!");
        });
    }

    render() {
        console.log("Props: ",this.props);
        return (
            <div>
                <div><h1>Este es el panel de agregar archivo</h1></div>
                <input type="file" onChange={ (e) => this.handleChange(e.target.files) } />
            </div>
        );
    }
}

export default withRouter(AddFile);
