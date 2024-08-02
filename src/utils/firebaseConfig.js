import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5S_IvwBv_w36yUGDQlAKvJqO-BMpYYX8",
  authDomain: "cakra-ai-7551a.firebaseapp.com",
  projectId: "cakra-ai-7551a",
  storageBucket: "cakra-ai-7551a.appspot.com",
  messagingSenderId: "716839074984",
  appId: "1:716839074984:web:38c0c235c746a1176b569d"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
