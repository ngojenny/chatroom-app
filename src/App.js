import React, { Component } from 'react';
import firebase, { db } from './firebase';
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
      if(user) {
        this.setState({user})
      }
    })
  }

  login = () => {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        })

        const userRef = db.collection('users').doc(user.uid);

        userRef.get().then((doc) => {
          if(doc.exists) {
            console.log('it exists!', doc.data());
          } else {
            console.log('doesnt exists, gonna make a new one');
            userRef.set({
              name: user.displayName,
              email: user.email,
              userUID: user.uid,
              created: firebase.firestore.Timestamp.fromDate(new Date()),
              privateRooms: [],
            })
          }
        })
      })
  }

  logout = () => {
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
