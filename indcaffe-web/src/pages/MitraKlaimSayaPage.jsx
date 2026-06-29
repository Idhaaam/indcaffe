import React, { useState, useEffect } from 'react';
import MitraLayout from '../components/MitraLayout';
import { Package, Clock, MapPin, Search } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import api from '../api';

const MitraKlaimSayaPage = () => {
  const [claims, setClaims] = useState([]);
  const [activeTab, setActiveTab] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/my-orders');
      setClaims(response.data || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
      setError('Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  // Map Backend OrderStatus to UI Status
  const getUiStatus = (status) => {
    if (status === 'PENDING') return 'Menunggu';
    if (status === 'APPROVED') return 'Disetujui';
    if (status === 'COMPLETED') return 'Selesai';
    if (status === 'CANCELLED' || status === 'REJECTED') return 'Ditolak';
    return status;
  };

  const filteredClaims = activeTab === 'Semua' 
    ? claims 
    : claims.filter(c => getUiStatus(c.status) === activeTab);

  return (
    <MitraLayout title="Mitra / Pesanan Saya">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <h1 style={{ fontSize: '28px', margin: 0 }}>Pesanan Saya</h1>
      </div>

      {/* Tabs Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
        <button className={activeTab === 'Semua' ? "btn btn-primary" : "btn btn-secondary"} style={{ borderRadius: '20px', background: activeTab === 'Semua' ? 'var(--accent-blue)' : 'transparent', borderColor: activeTab === 'Semua' ? 'var(--accent-blue)' : 'var(--border-color)', color: activeTab === 'Semua' ? 'white' : 'inherit' }} onClick={() => setActiveTab('Semua')}>Semua Pesanan</button>
        <button className={activeTab === 'Menunggu' ? "btn btn-primary" : "btn btn-secondary"} style={{ borderRadius: '20px', background: activeTab === 'Menunggu' ? 'var(--accent-orange)' : 'transparent', borderColor: activeTab === 'Menunggu' ? 'var(--accent-orange)' : 'var(--border-color)', color: activeTab === 'Menunggu' ? 'white' : 'inherit' }} onClick={() => setActiveTab('Menunggu')}>⏳ Menunggu</button>
        <button className={activeTab === 'Disetujui' ? "btn btn-primary" : "btn btn-secondary"} style={{ borderRadius: '20px', background: activeTab === 'Disetujui' ? 'var(--accent-green)' : 'transparent', borderColor: activeTab === 'Disetujui' ? 'var(--accent-green)' : 'var(--border-color)', color: activeTab === 'Disetujui' ? 'white' : 'inherit' }} onClick={() => setActiveTab('Disetujui')}>✅ Disetujui</button>
        <button className={activeTab === 'Selesai' ? "btn btn-primary" : "btn btn-secondary"} style={{ borderRadius: '20px', background: activeTab === 'Selesai' ? 'var(--text-secondary)' : 'transparent', borderColor: activeTab === 'Selesai' ? 'var(--text-secondary)' : 'var(--border-color)', color: activeTab === 'Selesai' ? 'white' : 'inherit' }} onClick={() => setActiveTab('Selesai')}>📦 Selesai</button>
        <button className={activeTab === 'Ditolak' ? "btn btn-primary" : "btn btn-secondary"} style={{ borderRadius: '20px', background: activeTab === 'Ditolak' ? 'var(--accent-red)' : 'transparent', borderColor: activeTab === 'Ditolak' ? 'var(--accent-red)' : 'var(--border-color)', color: activeTab === 'Ditolak' ? 'white' : 'inherit' }} onClick={() => setActiveTab('Ditolak')}>❌ Ditolak</button>
      </div>

      {/* List Card Klaim */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {loading ? (
          <p>Memuat data pesanan...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : filteredClaims.length === 0 ? (
          <EmptyState title="Tidak Ada Pesanan" message={`Anda belum memiliki riwayat pesanan dengan status ${activeTab}.`} />
        ) : (
          filteredClaims.map(claim => {
            const uiStatus = getUiStatus(claim.status);
            // Derive product name and quantity from items array
            const productName = claim.items && claim.items.length > 0 ? claim.items.map(i => i.productName).join(', ') : 'Pesanan';
            const totalQty = claim.items && claim.items.length > 0 ? claim.items.reduce((acc, curr) => acc + curr.quantity, 0) : 0;
            const orderDate = claim.orderDate ? new Date(claim.orderDate).toLocaleString('id-ID') : '-';

            return (
              <div key={claim.id} className="card animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '20px', display: 'flex', gap: '24px' }}>
                  
                  <div style={{ width: '80px', height: '80px', background: '#F5F5F5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={32} color="var(--text-secondary)" />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{productName}</h3>
                      <span className={`badge ${uiStatus === 'Menunggu' ? 'badge-orange' : uiStatus === 'Disetujui' ? 'badge-green' : uiStatus === 'Selesai' ? 'badge-blue' : 'badge-red'}`}>{uiStatus}</span>
                    </div>
                    
                    <p style={{ margin: '0 0 16px 0', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={14}/> Diajukan pada {orderDate}
                    </p>

                    <div style={{ display: 'flex', gap: '24px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Jumlah Item</span>
                        <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{totalQty}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Pengambilan</span>
                        <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{claim.deliveryMethod}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Total Harga</span>
                        <strong style={{ fontSize: '14px', color: 'var(--accent-orange)' }}>Rp {claim.totalAmount?.toLocaleString('id-ID') || 0}</strong>
                      </div>
                      {claim.cafeName && (
                        <div>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Café</span>
                          <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{claim.cafeName}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {uiStatus === 'Menunggu' && (
                  <div style={{ background: '#FFF3E0', padding: '12px 24px', borderTop: '1px solid #FFE0B2', fontSize: '13px', color: '#E65100' }}>
                    <strong>Mohon bersabar:</strong> Menunggu persetujuan dari Admin Café sebelum Anda bisa menjemput barang.
                  </div>
                )}
                {uiStatus === 'Disetujui' && (
                  <div style={{ background: '#E8F5E9', padding: '12px 24px', borderTop: '1px solid #C8E6C9', fontSize: '13px', color: '#2E7D32' }}>
                    <strong>Pesanan Disetujui!</strong> Silakan ambil pesanan Anda sesuai waktu yang ditentukan.
                  </div>
                )}
              </div>
            );
          })
        )}

      </div>
    </MitraLayout>
  );
};

export default MitraKlaimSayaPage;
