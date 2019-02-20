import React from 'react';
import {observer, inject} from 'mobx-react';
// import {computed} from 'mobx';

export default function asyncComponent(importComponent, hasHeader = true) {
    @inject('stores')
    @observer class AsyncComponent extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                component: null
            };
        }

        // @computed get userStore() {
        //     return this.props.stores.userStore;
        // }

        async componentDidMount() {
            console.log(importComponent);
            const {default: component} = await importComponent();
            // await this.userStore.setHeader(hasHeader);

            this.setState({component});
        }

        render() {
            const C = this.state.component;

            return C ? <C {...this.props}/> : <div className="m-lg text-center">加载中</div>;
        }
    }

    return AsyncComponent;
}
