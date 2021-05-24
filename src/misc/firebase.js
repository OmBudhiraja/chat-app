import firebase from 'firebase/app'

const config = {
    apiKey: "AIzaSyB9ARWJZZW8Q2yEhMIZOJMhzcUZ13jScD0",
    authDomain: "chat-web-app-ccd9e.firebaseapp.com",
    databaseURL: "https://chat-web-app-ccd9e-default-rtdb.firebaseio.com",
    projectId: "chat-web-app-ccd9e",
    storageBucket: "chat-web-app-ccd9e.appspot.com",
    messagingSenderId: "714668330755",
    appId: "1:714668330755:web:bdc325317c98480ea9a336"
};

const app = firebase.initializeApp(config)

export default app

