import React, {Component, Suspense} from "react";
import {withRouter, Switch, Redirect, Route} from "react-router-dom";
import {Layout, Breadcrumb, Row, Form} from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import "./_Body.scss"
// routes config
import routes from '../../routes';

const {Content, Footer} = Layout;

class Body extends Component {
    constructor(props) {
        super(props);
        this.mapRoutes = this.mapRoutes.bind(this);
    }

    loading = () => {
        return <div>The component is loading</div>
    }

    /*
    {routes.map((route, idx) => {
        console.log("lInk; ",route.path," whitn comp: ",route.component);
        return route.component ? (
          <Route
            key={idx}
            path={route.path}
            exact={route.exact}
            name={route.name}
            render={props => (
              <route.component {...props} />
            )} />
        ) : (null);
      })}
     */
    mapRoutes = () => {
        return (
             routes.map((route, idx) => {
                 //console.log("Mapping the path: ",route.path," whith component: ",route.name);
                 return route.component ? (
                      <Route
                           key={idx}
                           path={route.path}
                           exact={route.exact}
                           name={route.name}
                           render={props => (
                                <route.component {...props} />
                           )}/>
                 ) : (null);
             })
        );
    };

    render() {
        return (
            <Content>
                <Breadcrumb style={{margin: "16px 0"}}>
                    <Breadcrumb.Item>{this.props.activeSubmenu}</Breadcrumb.Item>
                    <Breadcrumb.Item>{this.props.activeSubmenu}</Breadcrumb.Item>
                </Breadcrumb>
                <div className="body">
                    <Row justify="center">
                        <Suspense fallback={this.loading()}>
                            <Switch>
                                {this.mapRoutes()}
                                <Redirect exact from="/AdminPage" to="/AdminPage/dashboard"/>
                            </Switch>
                        </Suspense>
                    </Row>
                </div>
                <Footer style={{textAlign: "center"}}>TuringSolutions</Footer>
            </Content>
        );
    }
}

export default withRouter(Form.create()(Body));
