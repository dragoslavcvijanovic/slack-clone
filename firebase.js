// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//import firebase from 'firebase';

import * as firebase from 'firebase';
import 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
/*
const firebaseConfig = {
  apiKey: "AIzaSyASIbLYc58UPATX8EAfEEEVhEQx5xz4eQA",
  authDomain: "slack-clone-37853.firebaseapp.com",
  databaseURL: "https://slack-clone-37853.firebaseio.com",
  projectId: "slack-clone-37853",
  storageBucket: "slack-clone-37853.appspot.com",
  messagingSenderId: "855254615378",
  appId: "1:855254615378:web:b24ce3ce785727a6cfa68b",
  measurementId: "G-J3D6DBKB7H"
};
*/
const firebaseConfig = {
  apiKey: "AIzaSyBv5frDqNN4c55XgaBHIsRIOeDX-k6qEbY",
  authDomain: "slack-caefb.firebaseapp.com",
  databaseURL: "https://slack-caefb.firebaseio.com",
  projectId: "slack-caefb",
  storageBucket: "slack-caefb.appspot.com",
  messagingSenderId: "1006787377677",
  appId: "1:1006787377677:web:20e5ec4e61afa24faff344",
  measurementId: "G-BC7KLH59EW"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
export  const auth = firebase.auth();
export  const provider = new firebase.auth.GoogleAuthProvider();

//export default auth;
export default db;
