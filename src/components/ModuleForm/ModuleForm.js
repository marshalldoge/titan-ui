import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Select, Typography, message} from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import {getCookie, withParams} from "../../utils";
import {connect} from "react-redux";
import * as constants from "../../constants";
import moduleReducer from "../../redux/reducers/moduleReducer";
const { Option } = Select;
const { Title } = Typography;
const Button= React.lazy(() => import("../TButton/TButton"));

class ModuleForm extends Component {
    constructor(props) {
        //console.log("PROPS comming in ADMINLAYOUT: ",props);
        super(props);
        this.handleActiveSubmenu = this.handleActiveSubmenu.bind(this)
    }

    state = {
        userData:{},
        Modules:{},
        SelectedActions:{}
    };

    componentDidMount = () => {
        this.loadModules();
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.idAppUser !== prevProps.idAppUser) {
            //console.log("Past idAppUser: ",prevProps.idAppUser," vs current: ",this.props.idAppUser);
            this.loadModules();
        }
    }

    loadModules(){
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let me = this;
        let params = {
            idAppUser:this.props.idAppUser,
            loc:true
        };
        var url = withParams(constants.BACKEND_URL+"/AppUserModuleAction/reducer", params);
        fetch(url, {
            method: "GET",
            headers: headers
        }).then(response => response.json())
            .then(function(data) {
                //console.log("Modules of: ",me.props.idAppUser," :: ",data);
                me.setState({Modules:data});
                let SelectedActions={};
                for (let key in data) {
                    if (data.hasOwnProperty(key)) {
                        //console.log(key + " -> " + actions[key]);
                        SelectedActions[key]=[];
                        for (let action in data[key].actions) {
                            if (data[key].actions.hasOwnProperty(action)) {
                                //console.log(key + " -> " + actions[key]);
                                if (data[key].actions[action]) {
                                    SelectedActions[key].push(action);
                                }
                            }
                        }
                    }
                }
                //console.log("Prototipo: ",SelectedActions);
                me.setState({SelectedActions:SelectedActions});
            });
    }

    handleActiveSubmenu=(newActiveSubmenu)=>{
        this.setState({activeSubmenu:newActiveSubmenu});
        //console.log("GOING TO SUBMENU; ",newActiveSubmenu.replace( /\s/g, ''));
        this.props.history.push(newActiveSubmenu.replace( /\s/g, '') );
    };



    ModuleSelect = (moduleName,value) => {
        let actions = value.actions;
        let options = [];
        let defaultValue = [];
        for (let key in actions) {
            if (actions.hasOwnProperty(key)) {
                //console.log(key + " -> " + actions[key]);
                options.push(
                  <Option key={key}>{key}</Option>
                );
                if(actions[key]){
                    defaultValue.push(key)
                }

            }
        }
        return (
            <div key={moduleName}>
                <Title level={4}>{moduleName}</Title>
                <Select
                    mode="multiple"
                    placeholder="Escoja los acciones permitidas..."
                    onChange={value => this.handleChange(value,moduleName)}
                    style={{ width: '100%' }}
                    defaultValue = {defaultValue}
                >
                    {options}
                </Select>
            </div>
        );
    };

    ModuleSelectGroup = () => {
        let modules = this.state.Modules;
        let res= [];
        for (let key in modules) {
            if (modules.hasOwnProperty(key)) {
                //console.log(key + " -> " + p[key]);
                res.push(this.ModuleSelect(key,modules[key]));
            }
        }
        //console.log("res",res);
        return res;
    };

    handleChange = (value,moduleName) => {
        //console.log("Selected:",value);
        //console.log("Target: ",moduleName);
        let SelectedActions = this.state.SelectedActions;
        SelectedActions[moduleName] = value;
        this.setState({
            SelectedActions:SelectedActions
        })

    };

    saveChanges = () => {
        //console.log("This is the object to sent: ",this.state.SelectedActions);
        let SelectedActions = this.state.SelectedActions;
        let appUserModuleAction = {

        };
        //Setting all in false
        let data = this.state.Modules;
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                //console.log(key + " has -> " + data[key].actions);
                let module = {
                    actions:{}
                };
                for (let action in data[key].actions) {
                    //console.log(key + " -> " + actions[key]);
                    if (data[key].actions.hasOwnProperty(action)) {
                        console.log(key + " -> " + data[key].actions[key]);
                        module.actions[action]=false;
                    }
                }

                appUserModuleAction[key] = module;
            }
        }
        //console.log("Formated res in false: ", appUserModuleAction);
        for (let mod in SelectedActions) {
            if (SelectedActions.hasOwnProperty(mod)) {
                //console.log(key + " -> " + actions[key]);
                console.log(mod+">"+SelectedActions[mod]);
                for (let i in SelectedActions[mod]) {
                    //console.log(key + " -> " + actions[key]);
                    let action = SelectedActions[mod][i];
                    appUserModuleAction[mod].actions[action]= true;
                }
            }
        }
        //console.log("Formated res: ", appUserModuleAction);

        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: getCookie("JWT")
        };
        let params = {
            idAppUser:this.props.idAppUser
        };
        const url = withParams(constants.BACKEND_URL+"/AppUserModuleAction", params);
        fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(appUserModuleAction)
        }).then(response => response.json())
            .then(function(response) {
                if(response.success){
                    message.success('Se ha guardado sus cambios exitosamente.');
                }else{
                    message.error('Hubo un error, inténtelo de nuevo.')
                }
            });


    };

    saveChangesButton = () => {
        return (
             <Button
                  label={"Guardar Cambios"}
                  size={"medium"}
                  onClick={this.saveChanges}
                  type={"inverse"}
             />
        );
    };

    render() {
        return (
            <div>
                {
                    this.ModuleSelectGroup()
                }
                <br />
                {this.saveChangesButton()}
            </div>
        );
    }
}
const mapStateToProps = state => {
    //const { appUserReducer } = state;
    //const { idAppUser } = appUserReducer;
    const { modules } = moduleReducer;
    return {modules};
};

export default withRouter(connect(mapStateToProps)(ModuleForm));
