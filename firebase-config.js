import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCyof00QTv4HOu1B_xR72adrpB2a9GLmuk",
    authDomain: "social-blog-93d38.firebaseapp.com",
    projectId: "social-blog-93d38",
    storageBucket: "social-blog-93d38.appspot.com",
    appId: "1:78643219054:web:dprl2lyih"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
