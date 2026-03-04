import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCyof00QTv4HOu1B_xR72adrpB2a9GLmuk",
    authDomain: "social-blog-93d38.firebaseapp.com",
    projectId: "social-blog-93d38",
    storageBucket: "social-blog-93d38.appspot.com",
    messagingSenderId: "78643219054",
    appId: "1:78643219054:web:dprl2lyih", // Aapki ID yahan jodh di gayi hai
    databaseURL: "https://social-blog-93d38-default-rtdb.firebaseio.com"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
