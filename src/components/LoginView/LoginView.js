import React, {Component} from 'react';

import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';

class LoginView extends Component {
  render() {
    return (
      <div className="card">
        <button onClick={this.login}>Login</button>
      </div>
    )
  }
}

export default LoginView;