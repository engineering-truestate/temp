import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: 'AIzaSyDenhyiV6Gt1LpIb0I2z9A9OkuPxEYVv7Y',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: 'iqol-crm',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: '1:695268023939:web:c0100eb97b384c0f1e05b6',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};


const appUser = initializeApp(firebaseConfig);
// Get Firestore instance
const db = getFirestore(appUser);
const analytics = getAnalytics(appUser);
const auth = getAuth(appUser);
// const Userdb = getFirestore(appUser);
// const Useranalytics = getAnalytics(appUser);
// const Userauth = getAuth(appUser);
const storage = getStorage(appUser);

export {
  appUser,
  db,
  analytics,
  auth,
  storage,
};
