importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-messaging.js');

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('../firebase-messaging-sw.js')
//     .then(function(registration) {
//       console.log('Registration successful, scope is:', registration.scope);
//     }).catch(function(err) {
//       console.log('Service worker registration failed, error:', err);
//     });
// }


firebase.initializeApp({
    apiKey: "AIzaSyB9ARWJZZW8Q2yEhMIZOJMhzcUZ13jScD0",
    authDomain: "chat-web-app-ccd9e.firebaseapp.com",
    databaseURL: "https://chat-web-app-ccd9e-default-rtdb.firebaseio.com",
    projectId: "chat-web-app-ccd9e",
    storageBucket: "chat-web-app-ccd9e.appspot.com",
    messagingSenderId: "714668330755",
    appId: "1:714668330755:web:bdc325317c98480ea9a336"
});

firebase.messaging();
