import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA-_QAIZkOgaGN1eaGM169P2sJq_F0N2z4",
  authDomain: "maro-344ca.firebaseapp.com",
  databaseURL: "https://maro-344ca-default-rtdb.firebaseio.com",
  projectId: "maro-344ca",
  storageBucket: "maro-344ca.firebasestorage.app",
  messagingSenderId: "375386206313",
  appId: "1:375386206313:web:7a5433f679f36ee84332f8",
  measurementId: "G-BKW00QXHHJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only on client side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Realtime Database
const database = getDatabase(app);

export { database, analytics }; 