// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArtVcoDk0uzNNKnkfyDTNNXSY7IXcWpjo",
  authDomain: "piggle-6cb06.firebaseapp.com",
  projectId: "piggle-6cb06",
  storageBucket: "piggle-6cb06.firebasestorage.app",
  messagingSenderId: "146231235973",
  appId: "1:146231235973:web:a915fa4cff1623539de0ec",
  measurementId: "G-FVWT814Z7Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;