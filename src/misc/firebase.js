/* eslint-disable import/no-extraneous-dependencies */
import firebase from 'firebase/app';
import 'firebase/auth';
import { Notification as Toast } from 'rsuite';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/messaging';
import 'firebase/functions';
import { isLocalhost } from './helpers';

const config = {
    apiKey: 'AIzaSyB9ARWJZZW8Q2yEhMIZOJMhzcUZ13jScD0',
    authDomain: 'chat-web-app-ccd9e.firebaseapp.com',
    databaseURL: 'https://chat-web-app-ccd9e-default-rtdb.firebaseio.com',
    projectId: 'chat-web-app-ccd9e',
    storageBucket: 'chat-web-app-ccd9e.appspot.com',
    messagingSenderId: '714668330755',
    appId: '1:714668330755:web:bdc325317c98480ea9a336',
};

const app = firebase.initializeApp(config);

export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();
export const functions = app.functions('europe-west3');
export const messaging = firebase.messaging.isSupported()
    ? app.messaging()
    : null;

if (messaging) {
    messaging.onMessage(({notification}) => {
        const {title, body} = notification
        Toast.info({title, description: body, duration: 0})
    });
}

if (isLocalhost) {
    functions.useEmulator('localhost', 5001);
}
