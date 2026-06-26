const baseUrl = 'http://localhost:8080/api';

async function runFullTest() {
    console.log("=== FULL E2E TEST ===\n");
    
    // 1. Register
    console.log("1. REGISTER...");
    let res = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: 'fulltest',
            password: 'pass123',
            type: 'CAFE',
            name: 'Cafe Full Test',
            city: 'Bandung',
            address: 'Jl. Full Test 123'
        })
    });
    console.log("   Status:", res.status, res.status === 200 ? "✅" : "❌");

    // 2. Login
    console.log("2. LOGIN...");
    res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'fulltest', password: 'pass123' })
    });
    const loginData = await res.json();
    const token = loginData.token;
    const cafeId = loginData.cafeId;
    console.log("   Token:", token ? "✅" : "❌");
    console.log("   CafeId:", cafeId ? `✅ (${cafeId})` : "❌ MISSING!");
    
    if (!token || !cafeId) { console.log("ABORT: No token or cafeId"); return; }

    const h = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    // 3. Create Category
    console.log("3. CREATE CATEGORY...");
    res = await fetch(`${baseUrl}/master/categories`, { method: 'POST', headers: h, body: JSON.stringify({ name: 'Minuman', cafe: { id: cafeId } }) });
    const cat = await res.json();
    console.log("   Status:", res.status, res.status === 200 ? "✅" : "❌", "id:", cat.id);

    // 4. Get Categories
    console.log("4. GET CATEGORIES...");
    res = await fetch(`${baseUrl}/master/categories/cafe/${cafeId}`, { headers: h });
    const cats = await res.json();
    console.log("   Status:", res.status, res.status === 200 ? "✅" : "❌", "count:", cats.length);

    // 5. Create Supplier
    console.log("5. CREATE SUPPLIER...");
    res = await fetch(`${baseUrl}/master/suppliers`, { method: 'POST', headers: h, body: JSON.stringify({ name: 'PT Kopi Nusantara', contact: '081234567890', cafe: { id: cafeId } }) });
    const sup = await res.json();
    console.log("   Status:", res.status, res.status === 200 ? "✅" : "❌", "id:", sup.id);

    // 6. Get Suppliers
    console.log("6. GET SUPPLIERS...");
    res = await fetch(`${baseUrl}/master/suppliers/cafe/${cafeId}`, { headers: h });
    const sups = await res.json();
    console.log("   Status:", res.status, res.status === 200 ? "✅" : "❌", "count:", sups.length);

    // 7. Create Product
    console.log("7. CREATE PRODUCT...");
    res = await fetch(`${baseUrl}/master/products`, { method: 'POST', headers: h, body: JSON.stringify({ name: 'Espresso Beans', category: { id: cat.id }, supplier: { id: sup.id }, cafe: { id: cafeId }, currentStock: 0, unit: 'Kg' }) });
    const prod = await res.json();
    console.log("   Status:", res.status, res.status === 200 ? "✅" : "❌", "id:", prod.id, "stock:", prod.currentStock);

    // 8. Get Products
    console.log("8. GET PRODUCTS...");
    res = await fetch(`${baseUrl}/master/products/cafe/${cafeId}`, { headers: h });
    const prods = await res.json();
    console.log("   Status:", res.status, res.status === 200 ? "✅" : "❌", "count:", prods.length);

    // 9. Incoming Transaction (add 100)
    console.log("9. INCOMING TRANSACTION (+100)...");
    res = await fetch(`${baseUrl}/transactions/`, { method: 'POST', headers: h, body: JSON.stringify({ product: { id: prod.id }, type: 'INCOMING', quantity: 100, notes: 'Restock dari supplier' }) });
    const txIn = await res.json();
    console.log("   Status:", res.status, res.status === 200 ? "✅" : "❌", "newStock:", txIn.product?.currentStock);

    // 10. Outgoing Transaction (use 30)
    console.log("10. OUTGOING TRANSACTION (-30 USED)...");
    res = await fetch(`${baseUrl}/transactions/`, { method: 'POST', headers: h, body: JSON.stringify({ product: { id: prod.id }, type: 'OUTGOING', outgoingType: 'USED', quantity: 30, notes: 'Produksi hari ini' }) });
    const txOut = await res.json();
    console.log("   Status:", res.status, res.status === 200 ? "✅" : "❌", "newStock:", txOut.product?.currentStock);

    // 11. Get Transactions
    console.log("11. GET ALL TRANSACTIONS...");
    res = await fetch(`${baseUrl}/transactions/cafe/${cafeId}`, { headers: h });
    const txs = await res.json();
    console.log("   Status:", res.status, res.status === 200 ? "✅" : "❌", "count:", txs.length);

    // 12. Create Surplus
    console.log("12. CREATE SURPLUS DONATION...");
    const expiry = new Date(Date.now() + 86400000).toISOString();
    res = await fetch(`${baseUrl}/transactions/surplus`, { method: 'POST', headers: h, body: JSON.stringify({ product: { id: prod.id }, cafe: { id: cafeId }, quantity: 10, expiryDate: expiry }) });
    const surp = await res.json();
    console.log("   Status:", res.status, res.status === 200 ? "✅" : "❌", "surplusId:", surp.id, "status:", surp.status);

    // 13. Get Surplus
    console.log("13. GET SURPLUS...");
    res = await fetch(`${baseUrl}/transactions/surplus/cafe/${cafeId}`, { headers: h });
    const surps = await res.json();
    console.log("   Status:", res.status, res.status === 200 ? "✅" : "❌", "count:", surps.length);

    // 14. Verify final stock
    console.log("14. VERIFY FINAL STOCK...");
    res = await fetch(`${baseUrl}/master/products/cafe/${cafeId}`, { headers: h });
    const finalProds = await res.json();
    const finalStock = finalProds[0]?.currentStock;
    const expectedStock = 100 - 30 - 10; // 60
    console.log("   Final stock:", finalStock, "Expected:", expectedStock, finalStock === expectedStock ? "✅" : "❌");

    console.log("\n=== ALL TESTS COMPLETE ===");
}

runFullTest();
