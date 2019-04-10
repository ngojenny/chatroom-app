import React, { Component } from 'react';

import firebase, { db } from '../../firebase';

class Chatroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draftedMessage: '',
      chatroomData: props.activeChatroomData,
      allMessages: [],
    }
  }

  componentDidMount() {
    this.getAllMessages();
  }

  componentDidUpdate(prevProps) {
    console.log(prevProps, this.props);
    if(prevProps.activeChatroomData.docId !== this.props.activeChatroomData.docId) {
      this.setState({
        chatroomData: this.props.activeChatroomData
      })
    }
  }

  getAllMessages = () => {
    const { docId } = this.props.activeChatroomData;
    const allMessagesRef = db.collection('chatrooms').doc(docId).collection('messages');
    
    allMessagesRef.orderBy('created', 'asc').onSnapshot((querySnapshot) => {
      const messagesFromDatabaseArray = [];
      querySnapshot.forEach((doc) => {
        console.log('get all', doc.data())
        messagesFromDatabaseArray.push(doc.data());
      })

      this.setState({
        allMessages: messagesFromDatabaseArray
      });
    });
  }

  handleChange = (e) => {
    this.setState({
      draftedMessage: e.target.value
    })
  }

  saveMessageInDatabase = (e) => {
    e.preventDefault();
    const { docId } = this.props.activeChatroomData;
    const messageRef = db.collection('chatrooms').doc(docId).collection('messages').doc();

    const message = {
      authorName: this.props.user.displayName,
      authorUID: this.props.user.uid,
      created: firebase.firestore.Timestamp.fromDate(new Date()),
      message: this.state.draftedMessage,
      messageId: messageRef.id
    }
    messageRef.set(message);
    this.setState({
      draftedMessage: ''
    })
  }

  render() {
    return (
      <div className="chatroom-window">
        <div className="chatroom-window-messages">
          {this.state.allMessages.map((doc) => {
            return(
              <div className="individual-message" key={doc.messageId}>
                <span>{doc.authorName}</span>
                <p>{doc.message}</p>
              </div>
            )
          })}
        </div>
        <form onSubmit={this.saveMessageInDatabase}>
          <label htmlFor="message">Enter message:</label>
          <textarea onChange={this.handleChange} name="message" id="message" value={this.state.draftedMessage}></textarea>
          <button>Send</button>
        </form>
      </div>
    )
  }
}

export default Chatroom;