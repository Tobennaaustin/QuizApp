import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

 const firebaseConfig = {
  apiKey: "AIzaSyD1ZKBvrOhjV-YD5cZT4vkC-HzmQx6YDhs",
  authDomain: "quizzapp-9932f.firebaseapp.com",
  projectId: "quizzapp-9932f",
  storageBucket: "quizzapp-9932f.firebasestorage.app",
  messagingSenderId: "945973270183",
  appId: "1:945973270183:web:a16557f530fa532ac02d82",
  measurementId: "G-XS06RBXXYH"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
