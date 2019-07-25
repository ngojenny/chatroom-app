import React, { Component } from 'react';

import { db } from '../../firebase';

import Sidebar from '../Sidebar/Sidebar';
import Chatroom from '../Chatroom/Chatroom';

import './AuthView.css';

class AuthView extends Component {
  constructor() {
    super();
    this.state = {
      activeChatroomData: null
    };
  }

  componentDidMount() {
    if (!this.state.chatroomData) {
      this.showNewestRoom();
      return;
    }
  }

  componentWillUnmount() {
    this.detachFirebaseListeners();
  }

  detachFirebaseListeners = () => {
    const unsubscribe = db
      .collection('chatrooms')
      .onSnapshot(querySnapshot => {});
    unsubscribe();
  };

  showNewestRoom = () => {
    const chatroomRef = db.collection('chatrooms');
    chatroomRef
      .orderBy('created', 'desc')
      .limit(1)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const newestRoomData = doc.data();
          this.setState({
            activeChatroomData: newestRoomData
          });
        });
      });
  };

  showActiveChatroom = chatroomId => {
    const activeChatroomRef = db.collection('chatrooms').doc(chatroomId);
    activeChatroomRef.get().then(doc => {
      if (doc.exists) {
        const activeChatroomData = doc.data();
        this.setState({
          activeChatroomData
        });
      } else {
        console.log('chatroom not found');
      }
    });
  };

  render() {
    return (
      <main className="card">
        <div className="authViewContainer">
          <Sidebar
            user={this.props.user}
            showActiveChatroom={this.showActiveChatroom}
          />
          {this.state.activeChatroomData && (
            <Chatroom
              user={this.props.user}
              activeChatroomData={this.state.activeChatroomData}
            />
          )}
        </div>
      </main>
    );
  }
}

export default AuthView;
