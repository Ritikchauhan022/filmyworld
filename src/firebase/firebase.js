// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDzwyniZa1WDfwZm0IFeacvhWWcpLNT87c",
  authDomain: "movie-f732d.firebaseapp.com",
  projectId: "movie-f732d",
  storageBucket: "movie-f732d.appspot.com",
  messagingSenderId: "34627344837",
  appId: "1:34627344837:web:0597df7c76329c24b3f0db"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);



// ✅ Yeh add karo:
export const getMoviesRef = () => collection(db, "movies");
export const getReviewsRef = () => collection(db, "reviews");
export const getUsersRef = () => collection(db, "users");



export { app, db, auth, addDoc };
