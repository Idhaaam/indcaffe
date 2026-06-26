import React, { useState } from 'react';
import InternalLayout from '../components/InternalLayout';
import { HeartHandshake, Check, X, Clock, MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import EmptyState from '../components/EmptyState';

const CafeKlaimMasukPage = () => {
  const { claims, setClaims } = useAppContext();
  const [activeTab, setActiveTab] = useState('Menunggu');

  const pendingClaims = claims.filter(c => c.status === 'Menunggu');
  const approvedClaims = claims.filter(c => c.status === 'Disetujui');
  const doneClaims = claims.filter(c => c.status === 'Selesai');

  const handleUpdateStatus = async (id, newStatus) => {
    if (newStatus === 'Selesai') {
      try {
        const { default: api } = await import('../api');
        await api.post(`/transactions/surplus/${id}/pickup`);
        // We could call fetchClaims here but it's passed from AppContext
        setClaims(claims.map(c => c.id === id ? { ...c, status: newStatus } : c));
      } catch (err) {
        alert('Gagal update status: ' + err.message);
      }
    } else {
      setClaims(claims.map(c => c.id === id ? { ...c, status: newStatus } : c));
    }
  };

  const displayedClaims = activeTab === 'Menunggu' ? pendingClaims : activeTab === 'Disetujui' ? approvedClaims : doneClaims;

  return (
    <InternalLayout title="Dashboard / Klaim Donasi Masuk">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <HeartHandshake size={28} color="var(--accent-blue)" />
        <h2 style={{ margin: 0 }}>Review Klaim Donasi</h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Daftar permintaan donasi makanan dari Mitra Penerima yang menunggu persetujuan Anda.</p>

      {/* Tabs Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button className={activeTab === 'Menunggu' ? "btn btn-primary" : "btn btn-secondary"} style={{ borderRadius: '20px', background: activeTab === 'Menunggu' ? 'var(--accent-blue)' : 'transparent', borderColor: activeTab === 'Menunggu' ? 'var(--accent-blue)' : 'var(--border-color)', color: activeTab === 'Menunggu' ? 'white' : 'inherit' }} onClick={() => setActiveTab('Menunggu')}>⏳ Menunggu Review ({pendingClaims.length})</button>
        <button className={activeTab === 'Disetujui' ? "btn btn-primary" : "btn btn-secondary"} style={{ borderRadius: '20px', background: activeTab === 'Disetujui' ? 'var(--accent-green)' : 'transparent', borderColor: activeTab === 'Disetujui' ? 'var(--accent-green)' : 'var(--border-color)', color: activeTab === 'Disetujui' ? 'white' : 'inherit' }} onClick={() => setActiveTab('Disetujui')}>✅ Disetujui ({approvedClaims.length})</button>
        <button className={activeTab === 'Selesai' ? "btn btn-primary" : "btn btn-secondary"} style={{ borderRadius: '20px', background: activeTab === 'Selesai' ? 'var(--text-secondary)' : 'transparent', borderColor: activeTab === 'Selesai' ? 'var(--text-secondary)' : 'var(--border-color)', color: activeTab === 'Selesai' ? 'white' : 'inherit' }} onClick={() => setActiveTab('Selesai')}>📦 Selesai Diambil ({doneClaims.length})</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {displayedClaims.length === 0 ? (
          <EmptyState title="Tidak Ada Klaim" message={`Saat ini belum ada klaim donasi dalam status ${activeTab}.`} />
        ) : (
          displayedClaims.map(claim => (
            <div key={claim.id} className="card animate-fade-in" style={{ borderLeft: `4px solid ${claim.status === 'Menunggu' ? 'var(--accent-orange)' : claim.status === 'Disetujui' ? 'var(--accent-green)' : 'var(--text-secondary)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className={`badge ${claim.status === 'Menunggu' ? 'badge-orange' : claim.status === 'Disetujui' ? 'badge-green' : 'badge-blue'}`}>{claim.status}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Diajukan: {claim.date}</span>
                  </div>
                  <h3 style={{ margin: '0 0 4px 0' }}>{claim.productName}</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Jumlah yang diminta: <strong>{claim.quantity}</strong></p>
                  
                  <div style={{ background: '#F5F5F5', padding: '12px', borderRadius: '8px', marginTop: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1565C0', fontWeight: 'bold' }}>
                      {claim.mitra.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: '500' }}>{claim.mitra}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12}/> {claim.delivery}
                      </p>
                    </div>
                  </div>
                </div>
                
                {claim.status === 'Menunggu' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px' }}>
                    <button className="btn btn-primary" style={{ background: 'var(--accent-green)', borderColor: 'var(--accent-green)', width: '100%', justifyContent: 'center' }} onClick={() => handleUpdateStatus(claim.id, 'Disetujui')}>
                      <Check size={18}/> Setujui
                    </button>
                    <button className="btn btn-secondary" style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)', width: '100%', justifyContent: 'center' }} onClick={() => handleUpdateStatus(claim.id, 'Ditolak')}>
                      <X size={18}/> Tolak
                    </button>
                  </div>
                )}
                {claim.status === 'Disetujui' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px' }}>
                    <button className="btn btn-primary" style={{ background: 'var(--text-secondary)', borderColor: 'var(--text-secondary)', width: '100%', justifyContent: 'center' }} onClick={() => handleUpdateStatus(claim.id, 'Selesai')}>
                      <Check size={18}/> Selesaikan
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

      </div>
    </InternalLayout>
  );
};

export default CafeKlaimMasukPage;
