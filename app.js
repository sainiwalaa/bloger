import { db, auth, storage } from './firebase-config.js';
import { collection, addDoc, onSnapshot, query, where, orderBy, serverTimestamp, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- ANTI-DOUBLE CLICK PROTECTION ---
window.safeClick = async (btn, callback) => {
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Hukum, kaam ho ryo hai...`;
    
    try {
        await callback();
    } finally {
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }, 2000); // 2 Second cool down
    }
};

// --- VIDEO 90s LIMIT CHECK ---
const validateVideo = (file) => {
    return new Promise((resolve, reject) => {
        if (file.type.includes('video')) {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = function() {
                window.URL.revokeObjectURL(video.src);
                if (video.duration > 90) reject("Hukum, video 90 second se bada nahi hona chahiye!");
                else resolve(true);
            };
            video.src = URL.createObjectURL(file);
        } else resolve(true);
    });
};

// --- REALTIME FEED (Darbar) ---
const loadFeed = () => {
    const q = query(collection(db, "posts"), orderBy("time", "desc"));
    onSnapshot(q, (snap) => {
        const cont = document.getElementById('feed-container');
        cont.innerHTML = "";
        snap.forEach(doc => {
            const d = doc.data();
            // Shop posts filtered out (as per prompt)
            if(!d.isShopItem) {
                renderPost(d, doc.id, cont);
            }
        });
    });
};

// --- ORDER FLOW SYSTEM ---
window.initiatePurchase = (productData) => {
    const modal = document.getElementById('order-modal');
    const btn = document.getElementById('final-order-btn');
    modal.classList.remove('hidden');

    btn.onclick = () => {
        safeClick(btn, async () => {
            const name = document.getElementById('cust-name').value;
            const phone = document.getElementById('cust-phone').value;
            const addr = document.getElementById('cust-address').value;

            if(!name || !phone || !addr) return alert("Hukum, saari jankari bharna zaroori hai!");

            // Save to Firestore
            await addDoc(collection(db, "orders"), {
                customerName: name,
                customerPhone: phone,
                address: addr,
                productName: productData.name,
                price: productData.price,
                creatorId: productData.creatorId,
                status: "New Order",
                time: serverTimestamp()
            });

            alert("Sauda Pakko! Ab aapko mukhya site par bheja ja raha hai.");
            window.location.href = productData.link;
        });
    };
};

// --- UI NAVIGATION ---
window.switchPage = (pageId) => {
    document.querySelectorAll('.page-sec').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`${pageId}-sec`).classList.remove('hidden');
    document.getElementById(`btn-${pageId}`).classList.add('active');
};

// --- INITIALIZE ---
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        loadFeed();
    }, 1500);
});
