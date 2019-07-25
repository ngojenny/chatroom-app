import React, { Component, Fragment } from 'react';

import { db } from '../../firebase';

import './NewChatroomForm.css';

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
      allChatroomMemberEmailFromDB: []
    };

    this.initialState = { ...this.state };
  }

  componentDidMount() {
    // grab all emails from the database and populate this.state.allChatroomMembers
    this._isMounted = true;

    db.collection('users').onSnapshot(querySnapshot => {
      const allEmails = [];
      querySnapshot.forEach(doc => {
        const docData = doc.data();
        allEmails.push(docData.email);
      });
      if (this._isMounted) {
        this.setState({
          allChatroomMemberEmailFromDB: allEmails
        });
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.error !== this.props.error) {
      this.setState({
        error: this.props.error
      });
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  setRoomToPrivate = e => {
    this.setState({
      isPrivate: e.target.checked
    });
  };

  addMembersToChatroom = e => {
    const addedChatroomMembersCopy = [...this.state.addedChatroomMembers];
    const hasError = this.validateMembersToBeAdded();

    if (hasError) {
      this.setState({
        chatroomMemberError: hasError,
        chatroomMemberEmail: ''
      });
    } else {
      addedChatroomMembersCopy.push(this.state.chatroomMemberEmail);
      this.setState({
        addedChatroomMembers: addedChatroomMembersCopy,
        chatroomMemberEmail: ''
      });
    }
  };

  validateMembersToBeAdded = () => {
    //check if it exists in the database
    const memberToBeAdded = this.state.chatroomMemberEmail;
    const inDatabaseCheck = this.state.allChatroomMemberEmailFromDB.indexOf(
      memberToBeAdded
    );
    const duplicateCheck = this.state.addedChatroomMembers.indexOf(
      memberToBeAdded
    );
    let errorMsg = null;

    if (inDatabaseCheck < 0) {
      errorMsg = 'Member was not found.';
    }

    if (duplicateCheck > -1) {
      errorMsg = 'Member has already been added.';
    }
    //check if it has been added already
    return errorMsg;
  };

  toggleForm = () => {
    this.setState(this.initalState);
    this.props.toggleForm();
  };

  render() {
    return (
      <div className="modal">
        <form
          className="newChatroomForm"
          onSubmit={e =>
            this.props.createChatroomInDatabase(
              e,
              this.state.chatroomName,
              this.state.isPrivate || false,
              this.state.addedChatroomMembers
            )
          }
        >
          <label htmlFor="chatroomName">Chatroom name:</label>
          <input
            onChange={this.handleChange}
            id="chatroomName"
            name="chatroomName"
            type="text"
          />
          {this.state.error && (
            <p className="userFeedback userFeedbackError">{this.state.error}</p>
          )}

          <label htmlFor="isPrivate">Private</label>
          <input
            onChange={this.setRoomToPrivate}
            type="checkbox"
            id="isPrivate"
            name="isPrivate"
          />
          {this.state.isPrivate && (
            <Fragment>
              <label htmlFor="chatroomMemberEmail"> Add member:</label>
              <div className="chatroomMemberAdditionContainer">
                <div className="memberInput">
                  <input
                    onChange={this.handleChange}
                    type="text"
                    id="chatroomMemberEmail"
                    name="chatroomMemberEmail"
                    value={this.state.chatroomMemberEmail}
                  />
                  {this.state.chatroomMemberError && (
                    <p className="userFeedback userFeedbackError">
                      {this.state.chatroomMemberError}
                    </p>
                  )}
                </div>
                <button
                  className="btn-add"
                  type="button"
                  onClick={this.addMembersToChatroom}
                >
                  +
                </button>
              </div>
              <ul className="membersEmailsContainer">
                {this.state.addedChatroomMembers.length > 0 &&
                  this.state.addedChatroomMembers.map(email => {
                    return (
                      <li key={email}>
                        <span className="memberEmail">{email}</span>
                      </li>
                    );
                  })}
              </ul>
            </Fragment>
          )}
          <div className="newChatroomFormButtonContainer">
            <button className="btn btn-primary" type="submit">
              Create room
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={this.toggleForm}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default NewChatroomForm;
