import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCogcNwYDYBQDqgacPM6x81nJqjDyExIO8",
  authDomain: "cakra-messenger-6d711.firebaseapp.com",
  projectId: "cakra-messenger-6d711",
  storageBucket: "cakra-messenger-6d711.appspot.com",
  messagingSenderId: "895916096273",
  appId: "1:895916096273:web:b1d61de16a68fdfed12ab0"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
