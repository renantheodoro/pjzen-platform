// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyB0IuIx44wHkT55V1b8EFF9Bz6PvGts-QE",
  authDomain: "pjzen-plataform-dev.firebaseapp.com",
  databaseURL: "https://pjzen-plataform-dev-default-rtdb.firebaseio.com",
  projectId: "pjzen-plataform-dev",
  storageBucket: "pjzen-plataform-dev.appspot.com",
  messagingSenderId: "324203579177",
  appId: "1:324203579177:web:93136ed0a7242f8a19d938",
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const functions = getFunctions();
