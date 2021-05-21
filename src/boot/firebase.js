import firebase from "firebase/app"
import "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCLDYquq7uE2_F8NUZBSUUDbbzj3AXMkwc",
  authDomain: "te-twitter.firebaseapp.com",
  projectId: "te-twitter",
  storageBucket: "te-twitter.appspot.com",
  messagingSenderId: "994533851781",
  appId: "1:994533851781:web:3c85604abe1da726ed1fec"
};

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();

export default db 