import React, {Component} from 'react';
import {HashRouter, Switch, Route, Redirect} from 'react-router-dom';
import AsyncComponent from '../components/AsyncComponent';

const Articles = AsyncComponent(() => import('../pages/Articles'), false);

export default class Router extends Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path='/articles' exact component={Articles} />
                    <Redirect to='/' />
                </Switch>
            </HashRouter>
        );
    }
}
