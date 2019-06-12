import React, { Component } from 'react';

import firebase, { db } from '../../firebase';
import Message from '../Message/Message.js';
import './Chatroom.css';

class Chatroom extends Component {
  _isMounted = false;
  
  constructor(props) {
    super(props);
    this.state = {
      draftedMessage: '',
      chatroomData: props.activeChatroomData,
      allMessages: [],
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.getAllMessages();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.activeChatroomData.docId !== this.props.activeChatroomData.docId) {
      this.setState({
        chatroomData: this.props.activeChatroomData
      })
      this.getAllMessages();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.detachFirebaseListeners();
  }

  detachFirebaseListeners = () => {
    const { docId } = this.props.activeChatroomData;
    const unsubscribe = db.collection('chatrooms').doc(docId).collection('messages').onSnapshot((querySnapshot) => {
    });
    unsubscribe();
  }

  getAllMessages = () => {
    const { docId } = this.props.activeChatroomData;
    const allMessagesRef = db.collection('chatrooms').doc(docId).collection('messages');
    
    allMessagesRef.orderBy('created', 'asc').onSnapshot((querySnapshot) => {
      const messagesFromDatabaseArray = [];
      querySnapshot.forEach((doc) => {
        messagesFromDatabaseArray.push(doc.data());
      })
      if(this._isMounted){
        this.setState({
          allMessages: messagesFromDatabaseArray
        });
      }
    });
  }

  handleChange = (e) => {
    this.setState({
      draftedMessage: e.target.value
    })
  }

  saveMessageInDatabase = (e) => {
    e.preventDefault();
    console.log('saving message');
    const { docId } = this.props.activeChatroomData;
    const messageRef = db.collection('chatrooms').doc(docId).collection('messages').doc();

    const privateMessageRef = db.collection('privateRooms').doc(docId).collection('messages').doc();

    const message = {
      authorName: this.props.user.displayName,
      authorUID: this.props.user.uid,
      created: firebase.firestore.Timestamp.fromDate(new Date()),
      message: this.state.draftedMessage,
      messageId: messageRef.id
    }

    messageRef.set(message);

    if(this.props.activeChatroomData.isPrivate) {
      privateMessageRef.set(message);
    }

    this.setState({
      draftedMessage: ''
    })
  }

  render() {
    return (
      <div className="chatroomWindow">
        <div className="chatroomWindowMessages">
          {this.state.allMessages.map((doc) => {
            return(
              <Message key={doc.messageId} authorName={doc.authorName} msg={doc.message} />
            )
          })}
        </div>
        <form onSubmit={this.saveMessageInDatabase}>
          <label htmlFor="message">Enter message:</label>
          <textarea onChange={this.handleChange} name="message" id="message" value={this.state.draftedMessage}></textarea>
          <button className="btn btn-secondary">Send</button>
        </form>
      </div>
    )
  }
}

export default Chatroom;