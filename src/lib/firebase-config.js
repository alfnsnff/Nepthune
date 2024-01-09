// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAy1xfQFhSXEVlLQSCf_iy4XceKXG76XNw",
  authDomain: "neptune-9037b.firebaseapp.com",
  projectId: "neptune-9037b",
  storageBucket: "neptune-9037b.appspot.com",
  messagingSenderId: "942145215800",
  appId: "1:942145215800:web:373920adfe8576400ef5cd",
  measurementId: "G-ZV67GBQGXZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;

export const googleProvider = new GoogleAuthProvider();