import React, { useState } from 'react';
import { Minus, Plus, Trash2, CreditCard, Truck, Store } from 'lucide-react';
import InternalLayout from '../components/InternalLayout';

const initialCart = [
  { id: 1, name: "Kopi Susu Gula Aren", cafe: "Kopi Kenangan", price: 10000, quantity: 2, image: "https://via.placeholder.com/80?text=Kopi" },
  { id: 2, name: "Croissant Butter", cafe: "Monsieur Spoon", price: 15000, quantity: 1, image: "https://via.placeholder.com/80?text=Roti" },
];

export default function CartPage() {
  const [cart, setCart] = useState(initialCart);
  const [deliveryMethod, setDeliveryMethod] = useState("Ambil Sendiri");
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");
  
  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = subtotal > 0 ? 5000 : 0; // Fixed mock discount
  const total = subtotal - discount;

  return (
    <InternalLayout title="Keranjang Belanja">
      <div className="cart-container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* Left Column: Items and Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}>
            <h3 style={{ marginTop: 0 }}>Daftar Pesanan</h3>
            {cart.length === 0 ? (
              <p>Keranjang Anda kosong.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '15px', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
                      <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>{item.cafe}</p>
                      <div style={{ fontWeight: 'bold', color: '#10b981' }}>Rp {item.price.toLocaleString('id-ID')}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button className="btn btn-outline" style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }} onClick={() => updateQuantity(item.id, -1)}><Minus size={16} /></button>
                      <span>{item.quantity}</span>
                      <button className="btn btn-outline" style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }} onClick={() => updateQuantity(item.id, 1)}><Plus size={16} /></button>
                    </div>
                    <button className="btn" style={{ padding: '8px', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => removeItem(item.id)}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}>
            <h3 style={{ marginTop: 0 }}>Detail Pengiriman</h3>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Nama Penerima</label>
              <input type="text" className="form-input" placeholder="Masukkan nama Anda" defaultValue="Budi Santoso" style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            
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
              {["Transfer Bank", "E-Wallet", "COD (Bayar di Tempat)"].map(method => (
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
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: 'white', position: 'sticky', top: '20px' }}>
          <h3 style={{ marginTop: 0 }}>Ringkasan Belanja</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#666' }}>Total Harga ({cart.length} barang)</span>
            <span>Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#666' }}>Diskon Surplus</span>
            <span style={{ color: '#ef4444' }}>- Rp {discount.toLocaleString('id-ID')}</span>
          </div>
          
          <hr style={{ border: 'none', borderTop: '1px dashed #ddd', margin: '15px 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontWeight: 'bold', fontSize: '18px' }}>
            <span>Total Bayar</span>
            <span style={{ color: '#10b981' }}>Rp {total.toLocaleString('id-ID')}</span>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: cart.length === 0 ? 'not-allowed' : 'pointer', opacity: cart.length === 0 ? 0.6 : 1 }} disabled={cart.length === 0}>
            <CreditCard size={20} /> Bayar Sekarang
          </button>
        </div>

      </div>
    </InternalLayout>
  );
}
