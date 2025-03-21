// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCk3zgMLzuXZM79F5QhbG9spZ5p_Tq7Gg",
  authDomain: "hk-invoice-new.firebaseapp.com",
  projectId: "hk-invoice-new",
  storageBucket: "hk-invoice-new.firebasestorage.app",
  messagingSenderId: "433334964621",
  appId: "1:433334964621:web:d4c679cf4a3193457a6dc4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
