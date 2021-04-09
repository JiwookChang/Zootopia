import firebase from "firebase"

const firebaseApp = firebase.initializeApp ({
    apiKey: "AIzaSyCjGTc4zzFzum1xQ__L25J4Qsv4-u2dOqw",
    authDomain: "zootopia-310211.firebaseapp.com",
    databaseURL: "https://zootopia-310211-default-rtdb.firebaseio.com",
    projectId: "zootopia-310211",
    storageBucket: "zootopia-310211.appspot.com",
    messagingSenderId: "741736056900",
    appId: "1:741736056900:web:e0280ba062428695a69411",
    measurementId: "G-9EREB6PJXG"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage };