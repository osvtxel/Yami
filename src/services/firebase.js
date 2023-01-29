import * as firebase from 'firebase/compat'
import  'firebase/compat/auth'
import  'firebase/compat/firestore'
import  'firebase/compat/storage'

var firebaseConfig = {
    apiKey: "AIzaSyALRKZl6Xn_tMijR2jdlUnAukEGZSwEERY",
    authDomain: "yameapp2021.firebaseapp.com",
    projectId: "yameapp2021",
    storageBucket: "yameapp2021.appspot.com",
    messagingSenderId: "433518283096",
    appId: "1:433518283096:web:80a090c0ea72a004d8bd2d",
    measurementId: "G-GHQ7FW71Y3"
};

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
    firebase.firestore().settings({ experimentalForceLongPolling: true });
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = app.auth();
const storage=app.storage();


export { db, auth, storage};