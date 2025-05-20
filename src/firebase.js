// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"; // 👈 Add this

const firebaseConfig = {
  apiKey: "AIzaSyBOet2SiUCUQHomQKp5ZvOGJ6j9u8uJMRQ",
  authDomain: "client-management-2d50d.firebaseapp.com",
  projectId: "client-management-2d50d",
  storageBucket: "client-management-2d50d.firebasestorage.app",
  messagingSenderId: "403560170413",
  appId: "1:403560170413:web:36fd576510172699581724",
  measurementId: "G-KBVKD8PQX7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // 👈 Add this

export { db, storage, auth }; // 👈 Export it
