import * as firebase from 'firebase';


const firebaseConfig = {
    apiKey: "AIzaSyBeD-8fm8rKHJnfzb8SsIFVDcswZvXtMxw",
    authDomain: "cryptoapp-b069e.firebaseapp.com",
    projectId: "cryptoapp-b069e",
    storageBucket: "cryptoapp-b069e.appspot.com",
    messagingSenderId: "42436102987",
    appId: "1:42436102987:web:ad513c2f511a4623f4f6ce",
    measurementId: "G-V076YZ1GFQ"
  };

let app;

if (firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
}
else {
    app = firebase.app();

}

const db = app.firestore();
const auth = firebase.auth();

export {db, auth}