// --- BAZAAR: SAVE PRODUCT ---
document.getElementById('save-product-btn')?.addEventListener('click', function() {
    const btn = this;
    safeClick(btn, async () => {
        const name = document.getElementById('p-name').value;
        const price = document.getElementById('p-price').value;
        const desc = document.getElementById('p-desc').value;
        const link = document.getElementById('p-link').value;
        const img = document.getElementById('p-img-url').value;

        if(!name || !price || !img) {
            alert("Hukum, Name, Price aur Photo zaroori hai!");
            return;
        }

        // Realtime Database mein Save (Creator Shop)
        const productRef = ref(db, 'products/');
        await push(productRef, {
            name, price, desc, link, img,
            creatorId: auth.currentUser.uid,
            time: serverTimestamp()
        });

        alert("Bazaar me maal rakha gaya! 🚩");
        document.getElementById('bazaar-form').classList.add('hidden');
    });
});

// --- BAZAAR: RENDER PRODUCTS ---
onValue(ref(db, 'products'), (snap) => {
    const cont = document.getElementById('bazaar-list');
    cont.innerHTML = "";
    snap.forEach(child => {
        const d = child.val();
        const id = child.key;

        cont.innerHTML += `
            <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg p-3">
                <img src="${d.img}" class="w-full h-32 object-cover rounded-xl mb-3 border border-yellow-900/20">
                <h3 class="gold-text font-bold text-xs truncate">${d.name}</h3>
                <p class="text-[10px] text-zinc-500 mb-2">₹${d.price}</p>
                <button onclick="initiatePurchase('${d.name}', '${d.price}', '${d.creatorId}', '${d.link}')" 
                    class="w-full bg-yellow-600/10 border border-yellow-600/50 text-yellow-500 py-2 rounded-lg text-[9px] font-bold uppercase tracking-tighter">
                    Sauda Karo
                </button>
            </div>
        `;
    });
});

// --- ORDER FLOW SYSTEM (Step 1, 2, 3) ---
window.initiatePurchase = (pName, pPrice, cId, pLink) => {
    // Step 1: Show Form
    const modal = document.getElementById('order-modal');
    modal.classList.remove('hidden');

    document.getElementById('final-order-btn').onclick = function() {
        const btn = this;
        safeClick(btn, async () => {
            const name = document.getElementById('cust-name').value;
            const phone = document.getElementById('cust-phone').value;
            const addr = document.getElementById('cust-address').value;

            if(!name || !phone || !addr) throw "Khali hai";

            // Step 2: Save Order Data in Realtime DB
            const orderRef = ref(db, 'orders/' + cId); // Creator ID ke folder me
            await push(orderRef, {
                custName: name,
                custPhone: phone,
                address: addr,
                product: pName,
                price: pPrice,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString()
            });

            // Step 3: Redirect to External Link
            alert("Hukum, Tharo Sauda darj ho gayo hai! Redirect ho rya ho...");
            window.location.href = pLink;
        });
    };
};
