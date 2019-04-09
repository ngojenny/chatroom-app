import React, {Component} from 'react';

import firebase from '../../firebase';

class Sidebar extends Component {
  constructor() {
    super();
    this.state = {}
  }

  componentDidMount() {

  }

  newChatroom = () => {
    const db = firebase.firestore();
    const chatroomRef = db.collection('chatrooms').doc();
    chatroomRef.set({
      admin: this.props.user.uid,
      name: 'Test'
    })

  }
  render() {
    return (
      <div className="sidebar">
        <button onClick={this.newChatroom}>New room</button>
      </div>
    )
  }
}

export default Sidebar;