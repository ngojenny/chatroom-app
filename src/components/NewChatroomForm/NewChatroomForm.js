import React, {Component} from 'react';

class NewChatroomForm extends Component {
  constructor() {
    super();
    this.state = {
      chatroomName: '',
      error: null,
    }
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
      chatroomName: e.target.value
    })
  }

  setRoomToPrivate = (e) => {
    this.setState({
      isPrivate: e.target.checked
    })
  }
  
  render() {
    return (
      <form onSubmit={(e) => this.props.createChatroomInDatabase(e,this.state.chatroomName, this.state.isPrivate || false)}>
        <label htmlFor="chatroomName">Chatroom name:</label>
        <input onChange={this.handleChange} id="chatroomName" name="chatroomName" type="text"/>
        {this.state.error &&
          <p class="user-feedback user-feedback-error">{this.state.error}</p>
        }

        <label htmlFor="isPrivate">Private</label>
        <input onChange={this.setRoomToPrivate} type="checkbox" id="isPrivate" name="isPrivate"/>
        <button>Create room</button>
      </form>
    )
  }
}

export default NewChatroomForm;