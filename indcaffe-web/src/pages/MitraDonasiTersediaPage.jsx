import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MitraLayout from '../components/MitraLayout';
import { Search, ShoppingCart, Filter, Send, X, CheckCircle, Clock, MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import EmptyState from '../components/EmptyState';
import api from '../api';

const MitraDonasiTersediaPage = () => {
  const { products, fetchProducts } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Jemput Sendiri');
  const [claimQty, setClaimQty] = useState('');

  const navigate = useNavigate();

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleKlaimClick = (product) => {
    setSelectedProduct(product);
    setClaimQty(product.sisa);
    setIsSuccess(false);
    setShowModal(true);
  };

  const handleChatClick = (product) => {
    if (product.cafeUserId) {
      navigate('/mitra/chat', { 
        state: { 
          newPartner: { 
            id: product.cafeUserId, 
            username: product.cafeUsername || product.cafe, 
            role: 'CAFE',
            productContext: product
          } 
        } 
      });
    } else {
      alert("Maaf, Cafe ini belum terhubung ke sistem Chat.");
    }
  };

  const handleConfirm = async () => {
    try {
      await api.post(`/transactions/surplus/${selectedProduct.id}/claim-dummy`);
      fetchProducts(); // Refresh list to show updated status
      
      setIsSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setIsSuccess(false);
      }, 2500);
    } catch (err) {
      alert('Gagal mengklaim donasi: ' + err.message);
    }
  };


  return (
    <MitraLayout title="Mitra / Etalase Surplus">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <ShoppingCart size={28} color="var(--primary-color)" />
        <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>Etalase Surplus</h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Pilih dan pesan produk surplus yang Anda butuhkan dari café-café di IndCaffe</p>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '24px', padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Cari roti, sayur, atau minuman..." 
            style={{ paddingLeft: '48px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select className="form-input" style={{ width: 'auto', padding: '10px 16px' }}>
          <option>Kategori: Semua</option>
          <option>Pastry & Roti</option>
          <option>Susu & Dairy</option>
          <option>Bahan Segar</option>
        </select>
        <select className="form-input" style={{ width: 'auto', padding: '10px 16px' }}>
          <option>Kota: Semua</option>
          <option>Jakarta</option>
          <option>Bandung</option>
        </select>
        <select className="form-input" style={{ width: 'auto', padding: '10px 16px' }}>
          <option>Sortir: Terdekat Kadaluarsa</option>
          <option>Terbaru</option>
          <option>Jumlah Terbanyak</option>
        </select>
      </div>

      {/* Grid Card */}
      {filteredProducts.length === 0 ? (
        <EmptyState title="Tidak Ada Produk" message="Saat ini tidak ada produk yang sesuai dengan pencarian Anda." />
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', position: 'relative' }}>
              
              {/* Chat Button */}
              <button 
                onClick={() => handleChatClick(product)}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--accent-orange)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 8px rgba(255, 152, 0, 0.3)', zIndex: 10 }}
                title="Chat dengan Cafe ini"
              >
                <Send size={18} />
              </button>

              <div style={{ padding: '20px' }}>
                <span className={`badge ${product.status === 'Tersedia' ? 'badge-green' : 'badge-orange'}`} style={{ marginBottom: '12px' }}>
                  📢 {product.status.toUpperCase()}
                </span>
                <h3 style={{ margin: '0 0 8px 0', paddingRight: '40px' }}>{product.name}</h3>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--primary-color)', fontSize: '18px' }}>
                  Rp {(product.price || 0).toLocaleString('id-ID')}
                </h4>
                <p style={{ margin: 0, fontWeight: '500', color: 'var(--text-secondary)' }}>☕ {product.cafe || 'IndCaffe Network'}</p>
                <div style={{ margin: '16px 0', padding: '12px', background: '#F5F5F5', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px' }}>Tersedia: <strong>{product.sisa}</strong></p>
                  <span className="badge" style={{ background: '#E0E0E0', color: '#616161', fontSize: '10px' }}>{product.category}</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', minHeight: '40px' }}>
                  {product.notes || `Sisa ${product.name.toLowerCase()} dari display kemarin.`}
                </p>
              </div>
              <div style={{ background: product.status === 'Tersedia' ? '#E8F5E9' : '#FFEBEE', padding: '16px', textAlign: 'center', borderTop: `1px solid ${product.status === 'Tersedia' ? '#C8E6C9' : '#FFCDD2'}`, borderBottom: `1px solid ${product.status === 'Tersedia' ? '#C8E6C9' : '#FFCDD2'}` }}>
                <h2 style={{ margin: 0, color: product.status === 'Tersedia' ? '#2E7D32' : '#C62828', fontFamily: 'monospace', fontSize: '24px' }}>Batas: {product.expiry}</h2>
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: product.status === 'Tersedia' ? '#2E7D32' : '#C62828' }}>
                  {product.status === 'Tersedia' ? 'Waktu masih panjang' : 'Segera ambil!'}
                </p>
              </div>
              <div style={{ padding: '16px' }}>
                <button onClick={() => handleKlaimClick(product)} className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  🛒 Pesan Produk Ini
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Klaim */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card animate-fade-in" style={{ width: '480px', maxWidth: '90%', padding: '32px', position: 'relative', borderRadius: '20px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: '#F5F5F5', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <X size={18} />
            </button>
            
            {isSuccess ? (
              <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                <div style={{ width: '80px', height: '80px', background: '#E8F5E9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                  <CheckCircle size={48} color="var(--accent-green)" />
                </div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '24px' }}>Pesanan Berhasil Dibuat!</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '15px', lineHeight: '1.6' }}>Permintaan pesanan Anda telah dikirim. Menunggu persetujuan dari Admin Café. Anda dapat memantau statusnya di menu "Riwayat Pesanan".</p>
              </div>
            ) : (
              <>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '22px' }}>Formulir Pemesanan</h3>
                <p style={{ color: 'var(--text-secondary)', margin: '0 0 24px 0', fontSize: '14px' }}>Mohon isi detail pesanan di bawah ini.</p>
                
                <div style={{ background: 'linear-gradient(to right, #F5F5F5, #FAFAFA)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <ShoppingCart size={24} color="var(--primary-color)" />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{selectedProduct?.name}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Stok saat ini: <strong style={{ color: 'var(--accent-orange)' }}>{selectedProduct?.sisa}</strong></p>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: 'var(--text-primary)' }}>Jumlah Pesanan</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontWeight: 'bold' }}>#</span>
                    <input type="text" className="form-input" value={claimQty} onChange={(e) => setClaimQty(e.target.value)} style={{ paddingLeft: '40px', fontSize: '16px', fontWeight: '500', padding: '14px 16px 14px 40px', borderRadius: '12px' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)' }}>Metode Pengambilan</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: deliveryMethod === 'Jemput Sendiri' ? '2px solid var(--accent-green)' : '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', background: deliveryMethod === 'Jemput Sendiri' ? '#F9FFF7' : 'transparent' }}>
                      <input type="radio" name="delivery" checked={deliveryMethod === 'Jemput Sendiri'} onChange={() => setDeliveryMethod('Jemput Sendiri')} style={{ width: '20px', height: '20px', accentColor: 'var(--accent-green)', cursor: 'pointer' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--text-primary)' }}>Jemput Sendiri</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Ambil langsung ke lokasi Café (Prioritas utama)</p>
                      </div>
                      <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontSize: '20px' }}>
                        🚗
                      </div>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: deliveryMethod === 'Butuh Diantar' ? '2px solid var(--accent-green)' : '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', background: deliveryMethod === 'Butuh Diantar' ? '#F9FFF7' : 'transparent' }}>
                      <input type="radio" name="delivery" checked={deliveryMethod === 'Butuh Diantar'} onChange={() => setDeliveryMethod('Butuh Diantar')} style={{ width: '20px', height: '20px', accentColor: 'var(--accent-green)', cursor: 'pointer' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--text-primary)' }}>Butuh Diantar</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Via kurir online (Biaya ditanggung Mitra)</p>
                      </div>
                      <div style={{ width: '40px', height: '40px', background: '#F5F5F5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        🛵
                      </div>
                    </label>

                  </div>
                </div>

                <div style={{ marginBottom: '24px', padding: '16px', background: '#FFF8E1', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Total Harga:</span>
                  <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--accent-orange)' }}>
                    Rp {((selectedProduct?.price || 0) * (parseInt(claimQty) || 0)).toLocaleString('id-ID')}
                  </span>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', boxShadow: '0 8px 16px rgba(46, 125, 50, 0.2)' }} onClick={handleConfirm}>
                  Pesan Sekarang ✨
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </MitraLayout>
  );
};

export default MitraDonasiTersediaPage;
