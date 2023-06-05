importScripts('https://www.gstatic.com/firebasejs/8.0.2/firebase-app.js'); 
importScripts('https://www.gstatic.com/firebasejs/8.0.2/firebase-messaging.js');
firebase.initializeApp({ 
    apiKey: "AIzaSyDQubkNERVqf2-ObTOAYvIhQ5_e_JwlimU",

    authDomain: "mojogos-43cad.firebaseapp.com",
  
    projectId: "mojogos-43cad",
  
    storageBucket: "mojogos-43cad.appspot.com",
  
    messagingSenderId: "944122490027",
  
    appId: "1:944122490027:web:4e1e48cdebd4d5dfcadbee",
  
    measurementId: "G-EK7N78EQL7"
});const messaging = firebase.messaging();