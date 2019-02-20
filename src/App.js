import React, { Component } from 'react';
import Router from './router';
// import {observer, inject} from 'mobx-react';
// import {computed} from 'mobx';
// import {LocaleProvider} from 'antd';
import 'moment/locale/zh-cn';
// import zhCN from 'antd/lib/locale-provider/zh_CN';
// import enUS from 'antd/lib/locale-provider/en_US';
// import {IntlProvider, addLocaleData} from 'react-intl';
// import en from 'react-intl/locale-data/en';
// import zh from 'react-intl/locale-data/zh';

class App extends Component {
    render() {
        return (
            <div className="app">
                <Router />
            </div>
        );
    }
}

export default App;
