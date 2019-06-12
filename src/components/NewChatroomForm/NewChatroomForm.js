import React, {Component, Fragment} from 'react';

import { db } from '../../firebase';

class NewChatroomForm extends Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      chatroomName: '',
      error: null,
      addedChatroomMembers: [],
      chatroomMemberEmail: '',
      chatroomMemberError: null,
      allChatroomMemberEmailFromDB: [],
    }
  }

  componentDidMount() {
    // grab all emails from the database and populate this.state.allChatroomMembers
    this._isMounted = true;

    db.collection('users').onSnapshot((querySnapshot) => {
      const allEmails = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        allEmails.push(docData.email);
      })
      if(this._isMounted) {
        this.setState({
          allChatroomMemberEmailFromDB: allEmails,
        })
      }
    })
  }

  componentDidUpdate(prevProps) {
    if(prevProps.error !== this.props.error) {
      this.setState({
        error: this.props.error
      })
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  setRoomToPrivate = (e) => {
    this.setState({
      isPrivate: e.target.checked
    })
  }

  addMembersToChatroom = (e) => {
    const addedChatroomMembersCopy = [...this.state.addedChatroomMembers];
    const hasError = this.validateMembersToBeAdded();

    if(hasError) {
      this.setState({
        chatroomMemberError: hasError,
        chatroomMemberEmail: ''
      })
    } else {
      addedChatroomMembersCopy.push(this.state.chatroomMemberEmail)
      this.setState({
        addedChatroomMembers: addedChatroomMembersCopy,
        chatroomMemberEmail: ''
      })
    }
  }

  validateMembersToBeAdded = () => {
    //check if it exists in the database
    const memberToBeAdded = this.state.chatroomMemberEmail;
    const inDatabaseCheck = this.state.allChatroomMemberEmailFromDB.indexOf(memberToBeAdded);
    const duplicateCheck = this.state.addedChatroomMembers.indexOf(memberToBeAdded)
    let errorMsg = null;

    if(inDatabaseCheck < 0) {
      errorMsg = 'Member was not found.'
    }

    if(duplicateCheck > -1) {
      errorMsg = 'Member has already been added.'
    }
    //check if it has been added already
    return errorMsg;
  }

  render() {
    return (
      <form onSubmit={(e) => this.props.createChatroomInDatabase(e,this.state.chatroomName, this.state.isPrivate || false, this.state.addedChatroomMembers)}>
        <label htmlFor="chatroomName">Chatroom name:</label>
        <input onChange={this.handleChange} id="chatroomName" name="chatroomName" type="text"/>
        {this.state.error &&
          <p className="userFeedback userFeedbackError">{this.state.error}</p>
        }

        <label htmlFor="isPrivate">Private</label>
        <input onChange={this.setRoomToPrivate} type="checkbox" id="isPrivate" name="isPrivate"/>
        {this.state.isPrivate && 
          <Fragment>
            <label htmlFor="chatroomMemberEmail"> Add members:</label>
            <input onChange={this.handleChange} type="text" id="chatroomMemberEmail" name="chatroomMemberEmail" value={this.state.chatroomMemberEmail}/>
            {this.state.chatroomMemberError && 
              <p className="userFeedback userFeedbackError">{this.state.chatroomMemberError}</p>
            }
            <button type="button" onClick={this.addMembersToChatroom}>Add</button>
            {this.state.addedChatroomMembers.length > 0 && 
              this.state.addedChatroomMembers.map((email) => {
                return (
                  <span key={email} className="memberEmails">{email}</span>
                )
              })
            }
          </Fragment>
        }
        <button type="submit">Create room</button>
      </form>
    )
  }
}

export default NewChatroomForm;