import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- ANTI DOUBLE CLICK PROTECTION ---
const royalClick = async (btnId, callback) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    
    btn.disabled = true;
    const originalText = btn.innerText;
    btn.innerText = "Hukum, kaam ho ryo hai...";
    
    try {
        await callback();
    } catch (err) {
        console.error(err);
        alert("Kshama karein, galti hui: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = originalText;
    }
};

// --- AUTH ---
document.getElementById('login-btn').addEventListener('click', () => {
    const e = document.getElementById('email').value;
    const p = document.getElementById('password').value;
    royalClick('login-btn', () => signInWithEmailAndPassword(auth, e, p));
});

onAuthStateChanged(auth, user => {
    if (user) {
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        document.getElementById('nav-bar').classList.remove('hidden');
        initApp();
    }
});

// --- NAVIGATION ---
window.switchPage = (page) => {
    ['darbar-sec', 'bazaar-sec', 'profile-sec'].forEach(s => document.getElementById(s).classList.add('hidden'));
    document.getElementById(`${page}-sec`).classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    event.currentTarget.classList.add('active');
};

// --- DATABASE SYNC ---
function initApp() {
    // 1. Darbar Feed (Public)
    onSnapshot(query(collection(db, "posts"), orderBy("time", "desc")), snap => {
        const cont = document.getElementById('feed-container');
        cont.innerHTML = "";
        snap.forEach(doc => {
            const data = doc.data();
            cont.innerHTML += `
                <div class="royal-card">
                    <div style="color:var(--gold-solid); font-weight:bold; margin-bottom:8px;">@${data.userName}</div>
                    <p>${data.text || ''}</p>
                    ${data.url ? (data.type === 'video' ? `<video src="${data.url}" controls style="width:100%"></video>` : `<img src="${data.url}" style="width:100%; border-radius:8px;">`) : ''}
                </div>`;
        });
    });

    // 2. Bazaar Feed (All Products)
    onSnapshot(collection(db, "products"), snap => {
        const bazaar = document.getElementById('bazaar-container');
        bazaar.innerHTML = "";
        snap.forEach(doc => {
            const p = doc.data();
            bazaar.innerHTML += `
                <div class="royal-card" style="margin:5px; text-align:center;">
                    <img src="${p.url}" style="width:100%; height:120px; object-cover:fit; border-radius:8px;">
                    <h4 style="margin:5px 0;">${p.name}</h4>
                    <div style="color:var(--gold-solid)">₹${p.price}</div>
                    <button class="gold-btn" style="padding:5px; margin-top:5px;" onclick="initiateOrder('${doc.id}', '${p.name}', '${p.price}', '${p.link}', '${p.creatorId}')">BUY</button>
                </div>`;
        });
    });
}

// --- ORDER SYSTEM ---
let currentOrder = null;
window.initiateOrder = (id, name, price, link, creatorId) => {
    currentOrder = { id, name, price, link, creatorId };
    document.getElementById('order-modal').classList.remove('hidden');
};

document.getElementById('confirm-order-btn').onclick = () => {
    royalClick('confirm-order-btn', async () => {
        const orderData = {
            ...currentOrder,
            custName: document.getElementById('cust-name').value,
            custPhone: document.getElementById('cust-phone').value,
            custAddr: document.getElementById('cust-addr').value,
            time: serverTimestamp(),
            date: new Date().toLocaleDateString()
        };
        await addDoc(collection(db, "orders"), orderData);
        window.location.href = currentOrder.link;
    });
};

window.closeOrderModal = () => document.getElementById('order-modal').classList.add('hidden');
