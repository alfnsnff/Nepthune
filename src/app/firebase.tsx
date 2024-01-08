// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLJXX4PZBcOjz3ScxLD3mu6fF5IhBs6HI",
  authDomain: "coba-da79c.firebaseapp.com",
  projectId: "coba-da79c",
  storageBucket: "coba-da79c.appspot.com",
  messagingSenderId: "734373899266",
  appId: "1:734373899266:web:52f040bcb592efd2640b1b",
  measurementId: "G-TCVTPX7FC5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
