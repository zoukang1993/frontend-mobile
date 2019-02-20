import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';

@inject('stores')
@observer
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return(
            <div>Home</div>
        );
    }
}

export default Home;
