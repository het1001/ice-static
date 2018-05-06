import React from 'react';
import ReactDOM from 'react-dom';
import { Alert, LocaleProvider } from 'antd';
import MyMenu from '../components/MyMenu';
import Main from '../components/Main';

import zhCN from 'antd/lib/locale-provider/zh_CN';

class App extends React.Component {
  constructor(props) {
    super(props);
    const hash = window.location.hash.substr(1);
    let current = 'commodity_list';
    if (hash) {
      current = hash;
    }

    this.state = {
      currentMenu: current,
      date: ''
    };
  }
  callback = (key) => {
    this.refs.main.changePage(key);
  }

  handleLoginout() {
    window.location = '/ice/pc/loginout.htm';
  }

  render() {
    return (
      <div>
        <Alert message={<span>欢迎使用<span style={{ position: 'absolute', right: 20 }}><a href="#" onClick={this.handleLoginout} >退出</a></span></span>} type="success" />
        <div>
          <MyMenu
            currentMenu={this.state.currentMenu}
            callback={this.callback.bind(this)}
            style={{ width: '15%', paddingLeft: '30px', float: 'left'}} />
          <Main ref="main"
                style={{ float: 'left'}}
                currentMenu={this.state.currentMenu} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<LocaleProvider locale={zhCN}><App /></LocaleProvider>, document.getElementById('root'));
