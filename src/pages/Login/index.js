import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';

@inject('stores')
@observer
class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return(
            <div>Login</div>
        );
    }
}

export default Login;
