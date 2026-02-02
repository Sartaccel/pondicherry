/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyXXXXXXXXXXXX",
  authDomain: "bellybutton-6b338.firebaseapp.com",
  projectId: "bellybutton-6b338",
  messagingSenderId: "106549345763",
  appId: "1:106549345763:web:XXXXXXXXXXXX"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("🔔 Background message:", payload);

  const { title, body, image } = payload.notification || {};

  self.registration.showNotification(title, {
    body,
    icon: image || "/favicon.ico",
    image: image
  });
});
