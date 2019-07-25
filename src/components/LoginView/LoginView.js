import React, { Component } from 'react';

class LoginView extends Component {
  render() {
    return (
      <div className="card">
        <button onClick={this.login}>Login</button>
      </div>
    );
  }
}

export default LoginView;
