const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

const config = {
  apiKey: "AIzaSyDijOoYrI1LDNtrCOUPnnFvvskUiORMGYw",
  authDomain: "chatroom-app-4da94.firebaseapp.com",
  databaseURL: "https://chatroom-app-4da94.firebaseio.com",
  projectId: "chatroom-app-4da94",
  storageBucket: "chatroom-app-4da94.appspot.com",
  messagingSenderId: "904961007200"
};

firebase.initializeApp(config);

export const db = firebase.firestore();
export default firebase;