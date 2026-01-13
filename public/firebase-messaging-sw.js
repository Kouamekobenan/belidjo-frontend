// Import du SDK FCM
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

// Config Firebase (la même que dans ton front)
const firebaseConfig = {
  apiKey: "AIzaSyD2FmNvffRnAxDnCao8BtHQ6kYFYD5WRo8",
  authDomain: "otp-findi.firebaseapp.com",
  projectId: "otp-findi",
  storageBucket: "otp-findi.appspot.com",
  messagingSenderId: "909580340044",
  appId: "1:909580340044:web:af1bc575356ed048929de9",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Ici tu peux gérer background notifications si besoin
messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
});
