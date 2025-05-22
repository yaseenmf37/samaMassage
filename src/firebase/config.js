import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4RONWF-FcrzcV4qUh2N-NbAhtLaG48Vw",
  authDomain: "samamassage-b67c3.firebaseapp.com",
  projectId: "samamassage-b67c3",
  storageBucket: "samamassage-b67c3.firebasestorage.app",
  messagingSenderId: "1024393141668",
  appId: "1:1024393141668:web:7008386b8d707d1592b531",
  measurementId: "G-J874T954PP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
