import React, { Component } from 'react';
import firebase from './firebase';
import AuthView from './components/AuthView/AuthView';
import Header from './components/Header/Header';

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      console.log('componentdidmount', user)
      if(user) {
        this.setState({user})
      }
    })
  }

  login = () => {
    console.log('logged in');
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        })
      })
  }

  logout = () => {
    console.log('log out');
    this.setState({
      user: null
    })
  }

  render() {
    return (
      <div className="App">
        <Header text={'AppTitle'}>
          {this.state.user ? 
            <button onClick={this.logout}>Logout</button> : 
            <button onClick={this.login}>Login</button>
          }
        </Header>
        {this.state.user &&
          <AuthView user={this.state.user}/>
        }
      </div>
    );
  }
}

export default App;
