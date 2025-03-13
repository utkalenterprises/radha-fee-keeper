
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlJoYEYdsZhfH2KZAuluFjYUurxEaluQU",
  authDomain: "rahasa-mandir.firebaseapp.com",
  projectId: "rahasa-mandir",
  storageBucket: "rahasa-mandir.firebasestorage.app",
  messagingSenderId: "97625836782",
  appId: "1:97625836782:web:5eb0ad8aba1a54fad7f7ff",
  measurementId: "G-WZNB87F91V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
