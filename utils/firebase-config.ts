import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
    apiKey: "AIzaSyBbjijjEzjPGw00JLW0DNq3DNM9nEIuFw8",
    authDomain: "chatgpt-movil-2025-1.firebaseapp.com",
    projectId: "chatgpt-movil-2025-1",
    storageBucket: "chatgpt-movil-2025-1.firebasestorage.app",
    messagingSenderId: "867401598386",
    appId: "1:867401598386:web:ecaa6b28941e506ec110ab"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);