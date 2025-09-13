// firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAbMq-w_wnJW2CwtFpbWeXY_L588G_jLy4",
  authDomain: "eco-reflection.firebaseapp.com",
  projectId: "eco-reflection",
  storageBucket: "eco-reflection.firebasestorage.app",
  messagingSenderId: "224456023962",
  appId: "1:224456023962:web:0e060c14057d6d1ae12423"
};

let app, auth, db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { auth, db };