import React, { Component } from 'react';

import firebase, { db } from '../../firebase';
import Message from '../Message/Message.js';
import './Chatroom.css';

class Chatroom extends Component {
  // create flag and check for this flag before setting state to fix memory leak warning
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      draftedMessage: '',
      chatroomData: props.activeChatroomData,
      allMessages: []
    };
  }

  // set flag
  // call function to query for messages
  componentDidMount() {
    this._isMounted = true;
    this.getAllMessages();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.activeChatroomData.docId !== this.props.activeChatroomData.docId
    ) {
      this.setState({
        chatroomData: this.props.activeChatroomData
      });
      this.getAllMessages();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.detachFirebaseListeners();
  }

  detachFirebaseListeners = () => {
    const { docId } = this.props.activeChatroomData;
    const unsubscribe = db
      .collection('chatrooms')
      .doc(docId)
      .collection('messages')
      .onSnapshot(querySnapshot => {});
    unsubscribe();
  };

  // query public chatrooms, get messages
  getAllMessages = () => {
    const { docId } = this.props.activeChatroomData;
    // create references to messages
    const allMessagesRef = db
      .collection('chatrooms')
      .doc(docId)
      .collection('messages');

    // query and sort messages
    allMessagesRef.orderBy('created', 'asc').onSnapshot(querySnapshot => {
      const messagesFromDatabaseArray = [];
      // for each query snapshot, call the data method, push the data object to array
      querySnapshot.forEach(doc => {
        messagesFromDatabaseArray.push(doc.data());
      });
      // set state
      if (this._isMounted) {
        this.setState({
          allMessages: messagesFromDatabaseArray
        });
      }
    });
  };

  handleChange = e => {
    this.setState({
      draftedMessage: e.target.value
    });
  };

  // on submit of chat box
  saveMessageInDatabase = e => {
    e.preventDefault();
    const { docId } = this.props.activeChatroomData;
    //create a ref to public chatroom doc
    const messageRef = db
      .collection('chatrooms')
      .doc(docId)
      .collection('messages')
      .doc();

    //create a ref to private chatroom doc
    const privateMessageRef = db
      .collection('privateRooms')
      .doc(docId)
      .collection('messages')
      .doc();

    //grab information for message being created.
    // check out https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp for Timestamp
    const message = {
      authorName: this.props.user.displayName,
      authorUID: this.props.user.uid,
      created: firebase.firestore.Timestamp.fromDate(new Date()),
      message: this.state.draftedMessage,
      messageId: messageRef.id
    };

    //save in database
    messageRef.set(message);

    // if its private, save it in the private chatroom
    if (this.props.activeChatroomData.isPrivate) {
      privateMessageRef.set(message);
    }

    // reset the state to empty string to clear chat box
    this.setState({
      draftedMessage: ''
    });
  };

  render() {
    return (
      <div className="chatroomWindow">
        <div className="chatroomWindowMessages">
          {this.state.allMessages.map(doc => {
            return (
              <Message
                key={doc.messageId}
                authorName={doc.authorName}
                authorUID={doc.authorUID}
                userUID={this.props.user.uid}
                msg={doc.message}
              />
            );
          })}
        </div>
        <form onSubmit={this.saveMessageInDatabase}>
          <label htmlFor="message">Enter message:</label>
          <textarea
            onChange={this.handleChange}
            name="message"
            id="message"
            value={this.state.draftedMessage}
          />
          <button className="btn btn-secondary">Send</button>
        </form>
      </div>
    );
  }
}

export default Chatroom;
