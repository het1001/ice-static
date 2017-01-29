import React from 'react';
import ReactDOM from 'react-dom';
import Login from '../components/Login';

class LoginApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div style={{ paddingTop: '15%' }}>
        <Login />
      </div>
    );
  }
}

ReactDOM.render(<LoginApp />, document.getElementById('root'));
