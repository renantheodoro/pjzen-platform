import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_APIKEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_PROJECTID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APPID,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
};

export const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
