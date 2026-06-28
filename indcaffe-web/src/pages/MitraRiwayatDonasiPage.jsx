import React from 'react';
import MitraLayout from '../components/MitraLayout';
import { ScrollText, Utensils, HeartHandshake, Leaf } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import EmptyState from '../components/EmptyState';

const MitraRiwayatDonasiPage = () => {
  const { claims } = useAppContext();
  const mitraName = localStorage.getItem('name') || 'Panti Asuhan Kasih';

  // Kalkulasi sederhana dari data claims
  const totalPesanan = claims.length;
  // Anggap 1 pesanan = 5 kg makanan untuk dummy perhitungan dampak
  const totalMakanan = totalPesanan * 5; 
  const totalCo2 = totalMakanan * 2.5;

  return (
    <MitraLayout title="Mitra / Riwayat & Dampak Saya">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ScrollText size={28} color="var(--primary-color)" />
          <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>Riwayat & Dampak Saya</h2>
        </div>
      </div>

      {/* Impact Summary Cards */}
      <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '32px' }}>
        <div className="card glass-card" style={{ background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Utensils size={24} style={{ opacity: 0.8 }} />
            <h2 style={{ color: 'white', fontSize: '36px', margin: 0 }}>{totalMakanan} kg</h2>
          </div>
          <h4 style={{ margin: '0 0 8px 0', opacity: 0.9 }}>Total Makanan Diterima</h4>
          <span style={{ fontSize: '13px', background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px' }}>Setara {totalMakanan * 3} porsi makan</span>
        </div>
        
        <div className="card glass-card" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Leaf size={24} style={{ opacity: 0.8 }} />
            <h2 style={{ color: 'white', fontSize: '36px', margin: 0 }}>{totalCo2} kg</h2>
          </div>
          <h4 style={{ margin: '0 0 8px 0', opacity: 0.9 }}>CO₂ Dicegah Bersama</h4>
          <span style={{ fontSize: '13px', background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px' }}>Dampak positif lingkungan</span>
        </div>

        <div className="card glass-card" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <HeartHandshake size={24} style={{ opacity: 0.8 }} />
            <h2 style={{ color: 'white', fontSize: '36px', margin: 0 }}>{totalPesanan} kali</h2>
          </div>
          <h4 style={{ margin: '0 0 8px 0', opacity: 0.9 }}>Total Pesanan Berhasil</h4>
          <span style={{ fontSize: '13px', background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px' }}>Terima kasih atas partisipasi Anda</span>
        </div>
      </div>

      {/* Thank You Banner */}
      <div className="card" style={{ background: 'linear-gradient(90deg, #E3F2FD 0%, #BBDEFB 100%)', border: '1px solid #90CAF9', marginBottom: '32px' }}>
        <p style={{ margin: 0, fontSize: '16px', color: '#1565C0', lineHeight: 1.5 }}>
          🌟 <strong>Terima kasih, {mitraName}!</strong> Anda telah membantu menyelamatkan makanan dari tempat sampah. Bersama kita bisa mengurangi food waste di Indonesia. 💚
        </p>
      </div>

      {/* Tabel Riwayat Lengkap */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: 0 }}>Riwayat Pesanan Lengkap</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select className="form-input" style={{ width: 'auto', padding: '8px 12px' }}>
              <option>Bulan Ini</option>
              <option>Bulan Lalu</option>
              <option>Tahun Ini</option>
              <option>Semua Waktu</option>
            </select>
          </div>
        </div>
        
        {claims.length === 0 ? (
          <EmptyState title="Belum Ada Riwayat" message="Anda belum pernah melakukan pesanan produk surplus." />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F5F5F5', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Tanggal</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Café</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Produk</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Jumlah</th>
                <th style={{ padding: '16px 24px', fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {claims.map(claim => (
                <tr key={claim.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px' }}>{claim.date}</td>
                  <td style={{ padding: '16px 24px', fontWeight: '500' }}>{claim.cafeName || 'IndCaffe Network'}</td>
                  <td style={{ padding: '16px 24px' }}>{claim.productName}</td>
                  <td style={{ padding: '16px 24px', fontWeight: 'bold', color: 'var(--accent-green)' }}>{claim.quantity}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={`badge ${claim.status === 'Selesai' ? 'badge-blue' : claim.status === 'Menunggu' ? 'badge-orange' : 'badge-green'}`}>{claim.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </MitraLayout>
  );
};

export default MitraRiwayatDonasiPage;
