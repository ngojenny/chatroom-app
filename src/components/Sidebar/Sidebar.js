import React, { Component } from "react";

import firebase from "../../firebase";
import NewChatroomForm from "../NewChatroomForm/NewChatroomForm";

const db = firebase.firestore();

class Sidebar extends Component {
  constructor() {
    super();
    this.state = {
      newChatroomFormVisible: false,
      error: null,
      chatrooms: []
    };
  }

  componentDidMount() {
    console.log("mounting");
    db.collection("chatrooms").onSnapshot(querySnapshot => {
      console.log("querySnapshot", querySnapshot);
      const chatroomsFromDatabaseArray = [];

      querySnapshot.forEach(doc => {
        console.log(doc.id, " => ", doc.data());
        chatroomsFromDatabaseArray.push(doc.data());
      });

      this.setState({
        chatrooms: chatroomsFromDatabaseArray
      });
    });
  }

  createChatroomInDatabase = (e, chatroomName) => {
    //called from <NewChatroomForm /> child component
    e.preventDefault();
    const chatroomRef = db.collection("chatrooms").doc();

    const trimmedChatroomName = chatroomName.trim();
    if (trimmedChatroomName.length > 0) {
      //send to firebase
      chatroomRef.set({
        admin: this.props.user.uid,
        name: chatroomName,
        docId: chatroomRef.id
      });
      //hide <NewChatroomForm />
      this.setState({
        newChatroomFormVisible: false
      });
    } else {
      this.setState({
        error: "Oopsy! Something went wrong, please try again"
      });
    }
  };

  showNewChatroomForm = () => {
    this.setState({
      newChatroomFormVisible: true
    });
  }

  render() {
    return (
      <div className="sidebar">
        <button onClick={this.showNewChatroomForm}>New room</button>
        {this.state.chatrooms.length > 0 && (
          this.state.chatrooms.map((chatroomData) => {
            return (
              <div className="chatroom-thumbnail">
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
