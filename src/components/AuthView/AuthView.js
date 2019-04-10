import React, {Component} from 'react';

import { db } from '../../firebase';

import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Chatroom from '../Chatroom/Chatroom';


class AuthView extends Component {
  constructor() {
    super();
    this.state = {
      activeChatroomData: null,
    }
  }

  showActiveChatroom = (chatroomId) => {
    const activeChatroomRef = db.collection('chatrooms').doc(chatroomId);
    activeChatroomRef.get().then((doc) => {
      if(doc.exists) {
        const activeChatroomData = doc.data();
        this.setState({
          activeChatroomData
        })
      } else {
        console.log('chatroom not found')
      }
    })
  }

  render() {
    return (
      <main className="card">
        <Header text={'Chatroom'} />
        <Sidebar user={this.props.user} showActiveChatroom={this.showActiveChatroom} />
        {this.state.activeChatroomData &&
          <Chatroom />
        }
      </main>
    )
  }
}

export default AuthView;