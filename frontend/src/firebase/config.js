import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBQtJGYROSKCcp7Gal7JWoXqfQv-3dlizw",
  authDomain: "ddd-system-bb8f1.firebaseapp.com",
  projectId: "ddd-system-bb8f1",
  storageBucket: "ddd-system-bb8f1.firebasestorage.app",
  messagingSenderId: "431496952686",
  appId: "1:431496952686:web:4419c7dae5bd9499329f7f",
  measurementId: "G-GTYRCXE2HM"
};

// Initialize
const app = initializeApp(firebaseConfig);

// Services export
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
