// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtsJaiKmm7g7M8HJ0N9QeEglKDTJDWRUM",
  authDomain: "chat-app-aebee.firebaseapp.com",
  projectId: "chat-app-aebee",
  storageBucket: "chat-app-aebee.firebasestorage.app",
  messagingSenderId: "767280352417",
  appId: "1:767280352417:web:1d477de8cddf1a6480b4e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);