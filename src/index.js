import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import {Provider} from 'mobx-react';
// import * as serviceWorker from './serviceWorker';
import stores from './stores';
import {unregister} from './serviceWorker';
// const fundebug = require('fundebug-javascript');
// fundebug.apikey = '68ba9effc9c743f11436663cd441bb4c411a03d36debbcd14cb2e68a7f038576';

if (!window.Intl) {
  global.Intl = require('intl');
}

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    componentDidCatch(error, info) {
        this.setState({hasError: true});
        // 将component中的报错发送到Fundebug
        //   fundebug.notifyError(error, {
        //     metaData: {
        //       info: info
        //     }
        //   });
    }

    render() {
        if (this.state.hasError) {
            return null;
        }

        return this.props.children;    
    }
}

  
(async () => {
    ReactDOM.render(
        <ErrorBoundary>
            <Provider stores={stores}>
                <App />
            </Provider>
        </ErrorBoundary>,
        document.getElementById('root')
    );
  })();
  
  // registerServiceWorker();
  unregister();
