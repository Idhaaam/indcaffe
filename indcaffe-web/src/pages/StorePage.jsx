import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ShoppingCart, MessageCircle } from 'lucide-react';
import InternalLayout from '../components/InternalLayout';
import { Helmet } from 'react-helmet-async';
import api from '../api';
import { formatRupiah } from '../utils/formatRupiah';

const categories = ["Semua", "Kopi", "Roti", "Kue", "Makanan Berat"];

export default function StorePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleChatClick = (transaction) => {
    const targetUserId = transaction.cafeUserId || transaction.cafe?.user?.id;
    if (targetUserId) {
      navigate('/pelanggan-chat', { 
        state: { 
          newPartner: { 
            id: targetUserId, 
            username: transaction.cafeUsername || transaction.cafe?.name || 'Cafe', 
            role: 'CAFE',
            productContext: { id: transaction.id, name: transaction.product?.name || 'Produk' }
          } 
        } 
      });
    } else {
      alert("Maaf, penjual belum dapat dihubungi melalui chat.");
    }
  };

  const addToCart = (transaction) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.surplusPostId === transaction.id);
    
    if (existingItem) {
      if (existingItem.quantity >= transaction.quantity) {
        alert("Stok tidak mencukupi!");
        return;
      }
      existingItem.quantity += 1;
    } else {
      cart.push({
        surplusPostId: transaction.id,
        name: transaction.product?.name || "Unknown Product",
        cafeName: transaction.cafe?.name || "Unknown Cafe",
        price: transaction.price || 0,
        quantity: 1,
        imageUrl: transaction.product?.imageUrl,
        maxStock: transaction.quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Berhasil ditambahkan ke keranjang!");
  };

  useEffect(() => {
    fetchSurplus();
  }, []);

  const fetchSurplus = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions/surplus');
      const limitedData = response.data.slice(0, 100); // Limit to 100 to prevent browser freeze
      setTransactions(limitedData);
    } catch (error) {
      console.error("Error fetching surplus:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const product = t.product || {};
    const categoryName = product.category?.name || product.category; // handle if it's string or object
    const matchesCategory = activeCategory === "Semua" || categoryName === activeCategory;
    const matchesSearch = (product.name || "").toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <InternalLayout title="Store / Surplus Market">
      <Helmet>
        <title>IndCaffe Store - Beli Surplus Makanan & Minuman</title>
        <meta name="description" content="Selamatkan makanan dan minuman surplus berkualitas tinggi dari cafe-cafe favorit Anda dengan harga murah di IndCaffe Store." />
      </Helmet>
      
      <div className="store-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="search-bar" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="form-group" style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '10px', top: '10px', color: '#666' }} size={20} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Cari makanan atau minuman..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>
        </div>

        <div className="filter-chips" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveCategory(cat)}
              style={{ borderRadius: '20px', whiteSpace: 'nowrap', padding: '8px 16px', border: '1px solid #10b981', background: activeCategory === cat ? '#10b981' : 'transparent', color: activeCategory === cat ? 'white' : '#10b981', cursor: 'pointer' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Memuat data surplus...</div>
        ) : filteredTransactions.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Tidak ada data surplus yang ditemukan.</div>
        ) : (
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {filteredTransactions.map((transaction, idx) => {
              const product = transaction.product || {};
              // Fallback to random image if none provided
              let image = `https://via.placeholder.com/150?text=${encodeURIComponent(product.name || 'Produk')}`;
              if (product.imageUrl) {
                image = product.imageUrl.startsWith('/uploads') ? `http://localhost:8081${product.imageUrl}` : product.imageUrl;
              }
              const price = product.price || 0;
              // Just a dummy display for normal price
              const normalPrice = price * 2; 

              return (
                <div key={transaction.id || idx} className="card" style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={image} alt={product.name} loading="lazy" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                    {transaction.quantity <= 3 && (
                      <span className="badge badge-warning" style={{ position: 'absolute', top: '10px', right: '10px', background: '#f59e0b', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        Hampir Habis
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{product.name || 'Unknown Product'}</h3>
                    <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>{product.category?.name || product.category || 'Kategori'}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div>
                        <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '12px' }}>{formatRupiah(normalPrice)}</span>
                        <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '18px' }}>{formatRupiah(price)}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '12px' }}>
                        <MapPin size={14} style={{ marginRight: '4px' }} />
                        {transaction.distance || '1.0 km'}
                      </div>
                    </div>
                    <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#666' }}>Sisa stok: {transaction.quantity}</p>
                      
                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                      <button 
                        className="btn btn-outline" 
                        onClick={() => handleChatClick(transaction)}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px', color: '#10b981', border: '1px solid #10b981', borderRadius: '4px', cursor: 'pointer', flex: 1 }}
                      >
                        <MessageCircle size={16} /> Chat
                      </button>
                      <button 
                        className="btn btn-primary" 
                        onClick={() => addToCart(transaction)}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', flex: 2 }}
                      >
                        <ShoppingCart size={16} /> Beli
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </InternalLayout>
  );
}
