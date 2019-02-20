import React from 'react';
import {Route} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
// import {computed} from 'mobx';

@inject('stores')
@observer
class LoginRoute extends React.Component {
    // @computed get userStore() {
    //     return this.props.stores.userStore;
    // }

  render() {
        // const {isLogined} = this.userStore;
        // if (!isLogined) {
        //     return <Redirect to="/login"></Redirect>;
        // }

        return <Route path={this.props.path} exact component={this.props.component} />;
  }
}

export default LoginRoute;
