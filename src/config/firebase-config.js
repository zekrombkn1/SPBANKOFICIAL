// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVn8EPa5PngOpdmTzf9OPaoLp9wQLB5hA",
  authDomain: "spbank-793c7.firebaseapp.com",
  databaseURL: "https://spbank-793c7-default-rtdb.firebaseio.com",
  projectId: "spbank-793c7",
  storageBucket: "spbank-793c7.appspot.com",
  messagingSenderId: "93324281026",
  appId: "1:93324281026:web:78882cee1b11c8a498e75b",
  measurementId: "G-9FFHYW7YJS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app);