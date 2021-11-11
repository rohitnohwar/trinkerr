import  firebase from "firebase/app";
import "firebase/auth"

var firebaseConfig={
    apiKey: "AIzaSyCsF5T3KO50vNtJYthoROpEh2XyXHs-Bvw",
    authDomain: "trinkerr2.firebaseapp.com",
    projectId: "trinkerr2",
    storageBucket: "trinkerr2.appspot.com",
    messagingSenderId: "344451265553",
    appId: "1:344451265553:web:d7f6b0c27ac718ed62edb0"
}

firebase.initializeApp(firebaseConfig);
export default firebase;