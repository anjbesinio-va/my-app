// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBbgHSFbrziDEESc9CyxCQZwxaGDD4dI8",
  authDomain: "taskmanagerapp-965fe.firebaseapp.com",
  projectId: "taskmanagerapp-965fe",
  storageBucket: "taskmanagerapp-965fe.appspot.com",
  messagingSenderId: "170251920286",
  appId: "1:170251920286:web:509bd517a166363be52c8f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
export const db = getFirestore(app);