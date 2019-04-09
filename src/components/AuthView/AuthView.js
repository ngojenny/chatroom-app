import React, {Component} from 'react';

import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';

class AuthView extends Component {
  render() {
    return (
      <main className="card">
        <Header text={'Chatroom'} />
        <Sidebar user={this.props.user}/>
      </main>
    )
  }
}

export default AuthView;