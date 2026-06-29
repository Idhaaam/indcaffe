import React, { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, CreditCard, Truck, Store } from 'lucide-react';
import InternalLayout from '../components/InternalLayout';
import api from '../api';
import { formatRupiah } from '../utils/formatRupiah';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [deliveryMethod, setDeliveryMethod] = useState("Ambil Sendiri");
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };
  
  const updateQuantity = (id, delta) => {
    const newCart = cart.map(item => {
      if (item.surplusPostId === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.min(item.maxStock, Math.max(1, newQty)) };
      }
      return item;
    });
    saveCart(newCart);
  };

  const removeItem = (id) => {
    const newCart = cart.filter(item => item.surplusPostId !== id);
    saveCart(newCart);
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const items = cart.map(item => ({
        surplusPostId: item.surplusPostId,
        quantity: item.quantity
      }));

      await api.post('/orders/checkout', {
        items,
        deliveryMethod,
        paymentMethod
      });

      toast.success("Checkout berhasil!");
      saveCart([]);
      navigate('/checkout-success');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal melakukan checkout");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = subtotal > 0 ? 0 : 0; // Removing fake discount
  const total = subtotal - discount;

  return (
    <InternalLayout title="Keranjang Belanja">
      <div className="cart-container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* Left Column: Items and Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}>
            <h3 style={{ marginTop: 0 }}>Daftar Pesanan</h3>
            {cart.length === 0 ? (
              <p>Keranjang Anda kosong. Silakan belanja di Toko Surplus.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {cart.map(item => (
                  <div key={item.surplusPostId} style={{ display: 'flex', gap: '15px', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                    <img src={item.imageUrl || `https://via.placeholder.com/80?text=${item.name}`} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
                      <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>{item.cafeName}</p>
                      <div style={{ fontWeight: 'bold', color: '#10b981' }}>{formatRupiah(item.price)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button className="btn btn-outline" style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }} onClick={() => updateQuantity(item.surplusPostId, -1)}><Minus size={16} /></button>
                      <span>{item.quantity}</span>
                      <button className="btn btn-outline" style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }} onClick={() => updateQuantity(item.surplusPostId, 1)}><Plus size={16} /></button>
                    </div>
                    <button className="btn" style={{ padding: '8px', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => removeItem(item.surplusPostId)}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}>
            <h3 style={{ marginTop: 0 }}>Detail Pengiriman</h3>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <button 
                className={`btn ${deliveryMethod === 'Ambil Sendiri' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '10px', borderRadius: '4px', border: '1px solid #10b981', background: deliveryMethod === 'Ambil Sendiri' ? '#10b981' : 'white', color: deliveryMethod === 'Ambil Sendiri' ? 'white' : '#10b981', cursor: 'pointer' }}
                onClick={() => setDeliveryMethod('Ambil Sendiri')}
              >
                <Store size={18} /> Ambil Sendiri
              </button>
              <button 
                className={`btn ${deliveryMethod === 'Pesan Antar' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '10px', borderRadius: '4px', border: '1px solid #10b981', background: deliveryMethod === 'Pesan Antar' ? '#10b981' : 'white', color: deliveryMethod === 'Pesan Antar' ? 'white' : '#10b981', cursor: 'pointer' }}
                onClick={() => setDeliveryMethod('Pesan Antar')}
              >
                <Truck size={18} /> Pesan Antar
              </button>
            </div>

            {deliveryMethod === 'Pesan Antar' && (
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px' }}>Alamat Pengiriman</label>
                <textarea className="form-input" placeholder="Masukkan alamat lengkap" style={{ width: '100%', padding: '10px', boxSizing: 'border-box', minHeight: '80px', border: '1px solid #ddd', borderRadius: '4px' }}></textarea>
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}>
            <h3 style={{ marginTop: 0 }}>Metode Pembayaran</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {["Transfer Bank", "COD (Bayar di Tempat)"].map(method => (
                <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '4px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value={method} 
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
            {(paymentMethod === "Transfer Bank") && (
              <div style={{ marginTop: '15px', padding: '15px', background: '#f9fafb', borderRadius: '4px', border: '1px dashed #ccc' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>Silakan unggah bukti transfer:</p>
                <input 
                  type="file" 
                  accept="image/*"
                  className="form-input" 
                  style={{ width: '100%', boxSizing: 'border-box' }} 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                />
                {previewImage && (
                  <div style={{ marginTop: '10px' }}>
                    <img src={previewImage} alt="Bukti Transfer" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px', border: '1px solid #ddd' }} />
                  </div>
                )}
                <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666' }}>Rekening Tujuan: BCA 123456789 a.n. IndCaffe</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: 'white', position: 'sticky', top: '20px' }}>
          <h3 style={{ marginTop: 0 }}>Ringkasan Belanja</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#666' }}>Total Harga ({cart.length} barang)</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          
          <hr style={{ border: 'none', borderTop: '1px dashed #ddd', margin: '15px 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontWeight: 'bold', fontSize: '18px' }}>
            <span>Total Bayar</span>
            <span style={{ color: '#10b981' }}>{formatRupiah(total)}</span>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={handleCheckout}
            style={{ width: '100%', padding: '12px', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: cart.length === 0 || loading ? 'not-allowed' : 'pointer', opacity: cart.length === 0 || loading ? 0.6 : 1 }} 
            disabled={cart.length === 0 || loading}
          >
            <CreditCard size={20} /> {loading ? "Memproses..." : "Bayar Sekarang"}
          </button>
        </div>

      </div>
    </InternalLayout>
  );
}
