import React, { Component } from 'react';

import firebase, { db } from '../../firebase';
import NewChatroomForm from '../NewChatroomForm/NewChatroomForm';

import './Sidebar.css'


class Sidebar extends Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      newChatroomFormVisible: false,
      error: null,
      publicChatrooms: [],
      privateChatrooms: [],
      activeTab: 'public',
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getAllChatrooms();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getAllChatrooms = () => {
    //update state with all public chatrooms
    db.collection('chatrooms').where('isPrivate', '==', false).orderBy('created', 'desc').onSnapshot(querySnapshot => {
      const chatroomsFromDatabaseArray = [];
      querySnapshot.forEach(doc => {
        chatroomsFromDatabaseArray.push(doc.data());
      });
      if(this._isMounted) {
        this.setState({
          publicChatrooms: chatroomsFromDatabaseArray
        });
      }
    });

    // update stuate with all private chatrooms
    db.collection('privateRooms').where('users', 'array-contains', this.props.user.uid).orderBy('created', 'desc').onSnapshot(querySnapshot => {
      const chatroomsFromDatabaseArray = [];
      querySnapshot.forEach(doc => {
        chatroomsFromDatabaseArray.push(doc.data());
      });
      if(this._isMounted){
        this.setState({
          privateChatrooms: chatroomsFromDatabaseArray
        });
      }
    });
  }

  createChatroomInDatabase = (e, chatroomName, isPrivate, addedChatroomMembers) => {
    //called from <NewChatroomForm /> child component
    e.preventDefault();
    const chatroomRef = db.collection('chatrooms').doc();
    const privateRoomsRef = db.collection('privateRooms').doc(chatroomRef.id);
    const usersRef = db.collection('users');

    const trimmedChatroomName = chatroomName.trim();
    if (trimmedChatroomName.length > 0) {
      //send to firebase
      chatroomRef.set({
        admin: this.props.user.uid,
        name: chatroomName,
        docId: chatroomRef.id,
        created: firebase.firestore.Timestamp.fromDate(new Date()),
        isPrivate: isPrivate
      });
      // if the chatroom is private, add it to both the user doc and the privateRooms collection
      if(addedChatroomMembers.length > 0 || isPrivate) {
        //TO REVISIT: probably not the best way to get all users uid
        // do we even need uid - emails are also unique
        const userQueries = addedChatroomMembers.map((email) => {
          return usersRef.where('email', '==', email);
        })

        const userQueriesPromises = userQueries.map((query) => {
          return query.get();
        });

        Promise.all(userQueriesPromises).then((values) => {
          const docsSnapshot = values.map((val) => {
            return val.docs
          });

          const flattenDocsSnapshot = [].concat(...docsSnapshot)

          const usersUIDs = flattenDocsSnapshot.map((doc) => {
            if(doc.exists) {
              const docData = doc.data();
              return docData.userUID;
            }
          })

          if(usersUIDs.indexOf(this.props.user.uid) < 0) {
            usersUIDs.push(this.props.user.uid);
          }
          

          privateRoomsRef.set({
            admin: this.props.user.uid,
            name: chatroomName,
            docId: chatroomRef.id,
            created: firebase.firestore.Timestamp.fromDate(new Date()),
            users: usersUIDs,
          })

          usersUIDs.forEach((uid) => {
            usersRef.doc(uid).update({
              privateRooms: firebase.firestore.FieldValue.arrayUnion(chatroomRef.id)
            })
          })

        })
      }
          
      //hide <NewChatroomForm />
      this.setState({
        newChatroomFormVisible: false
      });
    } else {
      this.setState({
        error: 'Oopsy! Something went wrong, please try again'
      });
    }
  }

  setActiveTab = () => {
    this.setState({
      activeTab: this.state.activeTab === 'public' ? 'private' : 'public'
    })
  }



  showNewChatroomForm = () => {
    this.setState({
      newChatroomFormVisible: true
    });
  }

  render() {
    return (
      <div className="sidebar">
        <h2>Chatroom</h2>
        <button className="btn btn-secondary" onClick={this.showNewChatroomForm}>New room</button>
        <button onClick={this.setActiveTab}>Public Chats</button>
        <button onClick={this.setActiveTab}>Private Chats</button>
        
        {(this.state.publicChatrooms.length > 0 && this.state.activeTab === 'public') && (
          this.state.publicChatrooms.map((chatroomData) => {
            return (
              <div onClick={() => this.props.showActiveChatroom(chatroomData.docId)} className="chatroomThumbnail" key={chatroomData.docId} data-name={chatroomData.docId}>
                <h3>{chatroomData.name}</h3>
              </div>
            )
          })
        )}
        {(this.state.privateChatrooms.length > 0 && this.state.activeTab === 'private') && (
          this.state.privateChatrooms.map((chatroomData) => {
            return (
              <div onClick={() => this.props.showActiveChatroom(chatroomData.docId)} className="chatroomThumbnail" key={chatroomData.docId} data-name={chatroomData.docId}>
                <h3>{chatroomData.name}</h3>
              </div>
            )
          })
        )}

        {/*new chatroom form - toggled visibility*/}
        {this.state.newChatroomFormVisible && (
          <NewChatroomForm
            createChatroomInDatabase={this.createChatroomInDatabase}
            error={this.state.error}
          />
        )}
      </div>
    );
  }
}

export default Sidebar;
