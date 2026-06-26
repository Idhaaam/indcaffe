import React from 'react';
import MitraLayout from '../components/MitraLayout';
import { ScrollText, Utensils, HeartHandshake, Leaf, Download } from 'lucide-react';

const MitraRiwayatDonasiPage = () => {
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
            <h2 style={{ color: 'white', fontSize: '36px', margin: 0 }}>120 kg</h2>
          </div>
          <h4 style={{ margin: '0 0 8px 0', opacity: 0.9 }}>Total Makanan Diterima</h4>
          <span style={{ fontSize: '13px', background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px' }}>Setara 360 porsi makan</span>
        </div>
        
        <div className="card glass-card" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Leaf size={24} style={{ opacity: 0.8 }} />
            <h2 style={{ color: 'white', fontSize: '36px', margin: 0 }}>300 kg</h2>
          </div>
          <h4 style={{ margin: '0 0 8px 0', opacity: 0.9 }}>CO₂ Dicegah Bersama</h4>
          <span style={{ fontSize: '13px', background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px' }}>Setara menanam 15 pohon</span>
        </div>

        <div className="card glass-card" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <HeartHandshake size={24} style={{ opacity: 0.8 }} />
            <h2 style={{ color: 'white', fontSize: '36px', margin: 0 }}>28 kali</h2>
          </div>
          <h4 style={{ margin: '0 0 8px 0', opacity: 0.9 }}>Total Donasi Berhasil</h4>
          <span style={{ fontSize: '13px', background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px' }}>Dari 12 café berbeda</span>
        </div>
      </div>

      {/* Thank You Banner */}
      <div className="card" style={{ background: 'linear-gradient(90deg, #E3F2FD 0%, #BBDEFB 100%)', border: '1px solid #90CAF9', marginBottom: '32px' }}>
        <p style={{ margin: 0, fontSize: '16px', color: '#1565C0', lineHeight: 1.5 }}>
          🌟 <strong>Terima kasih, Panti Asuhan Kasih!</strong> Anda telah membantu menyelamatkan 120 kg makanan dari tempat sampah. Bersama kita bisa mengurangi food waste di Indonesia. 💚
        </p>
      </div>

      {/* Tabel Riwayat Lengkap */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: 0 }}>Riwayat Donasi Lengkap</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select className="form-input" style={{ width: 'auto', padding: '8px 12px' }}>
              <option>Bulan Ini</option>
              <option>Bulan Lalu</option>
              <option>Tahun Ini</option>
            </select>
            <button className="btn btn-secondary" style={{ padding: '8px 12px' }}><Download size={16}/> Export PDF</button>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F5F5F5', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '16px 24px', fontWeight: '600' }}>Tanggal</th>
              <th style={{ padding: '16px 24px', fontWeight: '600' }}>Café</th>
              <th style={{ padding: '16px 24px', fontWeight: '600' }}>Produk</th>
              <th style={{ padding: '16px 24px', fontWeight: '600' }}>Kategori</th>
              <th style={{ padding: '16px 24px', fontWeight: '600' }}>Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px 24px' }}>24 Jun 2026</td>
              <td style={{ padding: '16px 24px', fontWeight: '500' }}>Kopi Kenangan Senja</td>
              <td style={{ padding: '16px 24px' }}>Roti Gandum</td>
              <td style={{ padding: '16px 24px' }}><span className="badge badge-orange">Pastry & Roti</span></td>
              <td style={{ padding: '16px 24px', fontWeight: 'bold', color: 'var(--accent-green)' }}>10 pcs</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px 24px' }}>21 Jun 2026</td>
              <td style={{ padding: '16px 24px', fontWeight: '500' }}>Brew & Bites</td>
              <td style={{ padding: '16px 24px' }}>Susu Murni</td>
              <td style={{ padding: '16px 24px' }}><span className="badge badge-blue">Susu & Dairy</span></td>
              <td style={{ padding: '16px 24px', fontWeight: 'bold', color: 'var(--accent-green)' }}>5 liter</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px 24px' }}>15 Jun 2026</td>
              <td style={{ padding: '16px 24px', fontWeight: '500' }}>Daily Grind</td>
              <td style={{ padding: '16px 24px' }}>Salad Sayur</td>
              <td style={{ padding: '16px 24px' }}><span className="badge badge-green">Bahan Segar</span></td>
              <td style={{ padding: '16px 24px', fontWeight: 'bold', color: 'var(--accent-green)' }}>8 porsi</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px 24px' }}>10 Jun 2026</td>
              <td style={{ padding: '16px 24px', fontWeight: '500' }}>Morning Bloom</td>
              <td style={{ padding: '16px 24px' }}>Banana Bread</td>
              <td style={{ padding: '16px 24px' }}><span className="badge badge-orange">Pastry & Roti</span></td>
              <td style={{ padding: '16px 24px', fontWeight: 'bold', color: 'var(--accent-green)' }}>12 pcs</td>
            </tr>
          </tbody>
        </table>
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'center' }}>
          <button className="btn btn-secondary" style={{ width: '100%', borderColor: 'transparent' }}>Muat Lebih Banyak...</button>
        </div>
      </div>
    </MitraLayout>
  );
};

export default MitraRiwayatDonasiPage;
