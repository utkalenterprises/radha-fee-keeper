
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Replace these with your actual Firebase config values from the Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyA_pl-nvDf9LhGEcB3lNmDF4XWuUTihX9E",
  authDomain: "member-management-demo.firebaseapp.com",
  projectId: "member-management-demo",
  storageBucket: "member-management-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
