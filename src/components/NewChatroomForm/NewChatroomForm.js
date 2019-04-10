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
  render() {
    return (
      <form onSubmit={(e) => this.props.createChatroomInDatabase(e,this.state.chatroomName)}>
        <label htmlFor="chatroomName">Chatroom name:</label>
        <input onChange={this.handleChange} id="chatroomName" name="chatroomName" type="text"/>
        {this.state.error &&
          <p class="user-feedback user-feedback-error">{this.state.error}</p>
        }
        <button>Create room</button>
      </form>
    )
  }
}

export default NewChatroomForm;