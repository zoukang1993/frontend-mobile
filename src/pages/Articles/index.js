import React, {Component} from 'react';
import {observer, inject, computed} from 'mobx-react';

@inject('stores')
@observer
class Articles extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return(
            <div>Articles</div>
        );
    }
}

export default Articles;
