import React, {Component} from 'react';
import {HashRouter, Switch} from 'react-router-dom';
import AsyncComponent from '../components/AsyncComponent';
import {Route} from 'react-router';

const Articles = AsyncComponent(() => import('../pages/Articles'));

export default class Router extends Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path="/articles" exact component={Articles} />
                </Switch>
            </HashRouter>
        );
    }
}
