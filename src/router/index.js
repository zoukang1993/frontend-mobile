import React, {Component} from 'react';
import {HashRouter, Switch, Route, Redirect} from 'react-router-dom';
import AsyncComponent from '../components/AsyncComponent';

const Home = AsyncComponent(() => import("../pages/Home"), false)
const Login = AsyncComponent(() => import("../pages/Login"), false);
const Articles = AsyncComponent(() => import('../pages/Articles'), false);

export default class Router extends Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/login" exact component={Login} />
                    <Route path="/articles" exact component={Articles} />
                    <Redirect to="/" />
                </Switch>
            </HashRouter>
        );
    }
}
