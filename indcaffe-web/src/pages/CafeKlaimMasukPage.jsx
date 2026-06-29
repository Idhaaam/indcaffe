import React, { useState, useEffect } from 'react';
import InternalLayout from '../components/InternalLayout';
import { HeartHandshake, Check, X, Clock, MapPin } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import api from '../api';

const CafeKlaimMasukPage = () => {
  const [claims, setClaims] = useState([]);
  const [activeTab, setActiveTab] = useState('Menunggu');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCafeOrders();
  }, []);

  const fetchCafeOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/cafe');
      setClaims(response.data || []);
    } catch (err) {
      console.error('Failed to fetch cafe orders', err);
      setError('Gagal memuat pesanan masuk');
    } finally {
      setLoading(false);
    }
  };

  const getUiStatus = (status) => {
    if (status === 'PENDING') return 'Menunggu';
    if (status === 'PAID') return 'Disetujui';
    if (status === 'COMPLETED') return 'Selesai';
    if (status === 'CANCELLED' || status === 'REJECTED') return 'Ditolak';
    return status;
  };

  const getBackendStatus = (uiStatus) => {
    if (uiStatus === 'Disetujui') return 'PAID';
    if (uiStatus === 'Ditolak') return 'CANCELLED';
    if (uiStatus === 'Selesai') return 'COMPLETED';
    return 'PENDING';
  };

  const handleUpdateStatus = async (id, newUiStatus) => {
    try {
      const backendStatus = getBackendStatus(newUiStatus);
      await api.put(`/orders/${id}/status?status=${backendStatus}`);
      
      setClaims(claims.map(c => c.id === id ? { ...c, status: backendStatus } : c));
      alert(`Pesanan berhasil di-${newUiStatus.toLowerCase()}`);
    } catch (err) {
      alert('Gagal update status: ' + (err.response?.data?.message || err.message));
    }
  };

  const pendingClaims = claims.filter(c => getUiStatus(c.status) === 'Menunggu');
  const approvedClaims = claims.filter(c => getUiStatus(c.status) === 'Disetujui');
  const doneClaims = claims.filter(c => getUiStatus(c.status) === 'Selesai');

  const displayedClaims = activeTab === 'Menunggu' ? pendingClaims : activeTab === 'Disetujui' ? approvedClaims : doneClaims;

  return (
    <InternalLayout title="Dashboard / Pesanan Masuk">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <HeartHandshake size={28} color="var(--accent-blue)" />
        <h2 style={{ margin: 0 }}>Review Pesanan Masuk</h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Daftar pesanan produk surplus dari Pelanggan & Mitra yang menunggu persetujuan Anda.</p>

      {/* Tabs Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button className={activeTab === 'Menunggu' ? "btn btn-primary" : "btn btn-secondary"} style={{ borderRadius: '20px', background: activeTab === 'Menunggu' ? 'var(--accent-blue)' : 'transparent', borderColor: activeTab === 'Menunggu' ? 'var(--accent-blue)' : 'var(--border-color)', color: activeTab === 'Menunggu' ? 'white' : 'inherit' }} onClick={() => setActiveTab('Menunggu')}>⏳ Menunggu Review ({pendingClaims.length})</button>
        <button className={activeTab === 'Disetujui' ? "btn btn-primary" : "btn btn-secondary"} style={{ borderRadius: '20px', background: activeTab === 'Disetujui' ? 'var(--accent-green)' : 'transparent', borderColor: activeTab === 'Disetujui' ? 'var(--accent-green)' : 'var(--border-color)', color: activeTab === 'Disetujui' ? 'white' : 'inherit' }} onClick={() => setActiveTab('Disetujui')}>✅ Disetujui ({approvedClaims.length})</button>
        <button className={activeTab === 'Selesai' ? "btn btn-primary" : "btn btn-secondary"} style={{ borderRadius: '20px', background: activeTab === 'Selesai' ? 'var(--text-secondary)' : 'transparent', borderColor: activeTab === 'Selesai' ? 'var(--text-secondary)' : 'var(--border-color)', color: activeTab === 'Selesai' ? 'white' : 'inherit' }} onClick={() => setActiveTab('Selesai')}>📦 Selesai Diambil ({doneClaims.length})</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {loading ? (
          <p>Memuat pesanan masuk...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : displayedClaims.length === 0 ? (
          <EmptyState title="Tidak Ada Pesanan" message={`Saat ini belum ada pesanan dalam status ${activeTab}.`} />
        ) : (
          displayedClaims.map(claim => {
            const uiStatus = getUiStatus(claim.status);
            const orderDate = claim.orderDate ? new Date(claim.orderDate).toLocaleString('id-ID') : '-';
            const productName = claim.items && claim.items.length > 0 ? claim.items.map(i => i.productName).join(', ') : 'Pesanan';
            const orderQty = claim.items && claim.items.length > 0 ? claim.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
            const buyerName = claim.buyerName || 'Pembeli';
            
            return (
              <div key={claim.id} className="card animate-fade-in" style={{ borderLeft: `4px solid ${uiStatus === 'Menunggu' ? 'var(--accent-orange)' : uiStatus === 'Disetujui' ? 'var(--accent-green)' : 'var(--text-secondary)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span className={`badge ${uiStatus === 'Menunggu' ? 'badge-orange' : uiStatus === 'Disetujui' ? 'badge-green' : 'badge-blue'}`}>{uiStatus}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Diajukan: {orderDate}</span>
                    </div>
                    <h3 style={{ margin: '0 0 4px 0' }}>{productName}</h3>
                    <div style={{ display: 'flex', gap: '24px' }}>
                      <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Jumlah Item: <strong>{orderQty}</strong></p>
                      <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Total: <strong style={{ color: 'var(--accent-orange)' }}>Rp {claim.totalAmount?.toLocaleString('id-ID') || 0}</strong></p>
                    </div>
                    
                    <div style={{ background: '#F5F5F5', padding: '12px', borderRadius: '8px', marginTop: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1565C0', fontWeight: 'bold' }}>
                        {buyerName.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: '500' }}>{buyerName}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12}/> {claim.deliveryMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {uiStatus === 'Menunggu' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px' }}>
                      <button className="btn btn-primary" style={{ background: 'var(--accent-green)', borderColor: 'var(--accent-green)', width: '100%', justifyContent: 'center' }} onClick={() => handleUpdateStatus(claim.id, 'Disetujui')}>
                        <Check size={18}/> Setujui
                      </button>
                      <button className="btn btn-secondary" style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)', width: '100%', justifyContent: 'center' }} onClick={() => handleUpdateStatus(claim.id, 'Ditolak')}>
                        <X size={18}/> Tolak
                      </button>
                    </div>
                  )}
                  {uiStatus === 'Disetujui' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px' }}>
                      <button className="btn btn-primary" style={{ background: 'var(--text-secondary)', borderColor: 'var(--text-secondary)', width: '100%', justifyContent: 'center' }} onClick={() => handleUpdateStatus(claim.id, 'Selesai')}>
                        <Check size={18}/> Selesaikan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

      </div>
    </InternalLayout>
  );
};

export default CafeKlaimMasukPage;
