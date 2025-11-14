// Configurazione Firebase per Next.js
// 1. Crea un progetto su https://console.firebase.google.com/
// 2. Prendi le credenziali dal pannello (API key, projectId, ecc.)
// 3. Inseriscile qui sotto

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCKQcA0QixJvYIUsamnLfy5XoxycttSLsY",
  authDomain: "marbel-34a5f.firebaseapp.com",
  projectId: "marbel-34a5f",
  storageBucket: "marbel-34a5f.firebasestorage.app",
  messagingSenderId: "145918489871",
  appId: "1:145918489871:web:27b0ad142284718fb97a7a",
  measurementId: "G-SHM706VQDP",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
