import React from 'react';
import InternalLayout from '../components/InternalLayout';
import { AlertTriangle, Megaphone, HeartHandshake } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ExpiryAlertPage = () => {
  const { expiryAlerts } = useAppContext();

  return (
    <InternalLayout title="Dashboard / Expiry Alert">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <AlertTriangle size={28} color="var(--accent-red)" />
        <h2 style={{ margin: 0 }}>Peringatan Kadaluarsa</h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Produk yang mendekati tanggal kadaluarsa dan perlu segera ditindaklanjuti.</p>

      {expiryAlerts && expiryAlerts.length > 0 ? (
        <>
          <div style={{ padding: '16px', background: '#FFEBEE', border: '1px solid #EF5350', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle color="#C62828" />
            <p style={{ margin: 0, color: '#C62828', fontWeight: '500' }}>⚠️ {expiryAlerts.length} produk akan kadaluarsa dalam waktu dekat! Segera donasikan atau posting sebagai surplus sebelum terlambat.</p>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--primary-color)', color: 'white' }}>
                  <th style={{ padding: '16px 24px', width: '50px' }}>Urgensi</th>
                  <th style={{ padding: '16px 24px' }}>Produk</th>
                  <th style={{ padding: '16px 24px' }}>Kategori</th>
                  <th style={{ padding: '16px 24px' }}>Sisa Stok</th>
                  <th style={{ padding: '16px 24px' }}>Tanggal Exp</th>
                  <th style={{ padding: '16px 24px' }}>Aksi Cepat</th>
                </tr>
              </thead>
              <tbody>
                {expiryAlerts.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)', background: '#FFEBEE' }}>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>🔴</td>
                    <td style={{ padding: '16px 24px', fontWeight: '600' }}>{product.name}</td>
                    <td style={{ padding: '16px 24px' }}>{product.category?.name || '-'}</td>
                    <td style={{ padding: '16px 24px' }}>{product.currentStock} {product.unit}</td>
                    <td style={{ padding: '16px 24px', color: '#C62828', fontWeight: 'bold' }}>{product.expiryDate}</td>
                    <td style={{ padding: '16px 24px', display: 'flex', gap: '8px' }}>
                      <button className="btn" style={{ padding: '8px 12px', background: 'var(--accent-blue)', color: 'white' }}><HeartHandshake size={14}/> Donasikan</button>
                      <button className="btn" style={{ padding: '8px 12px', background: 'var(--accent-orange)', color: 'white' }}><Megaphone size={14}/> Post Surplus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div style={{ padding: '48px', textAlign: 'center', background: '#F5F5F5', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
          <AlertTriangle size={48} color="var(--accent-green)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ color: 'var(--text-primary)' }}>Aman! Tidak ada produk yang mendekati kadaluarsa.</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Semua stok produk Anda masih dalam kondisi segar dan memiliki masa simpan yang cukup panjang.</p>
        </div>
      )}
    </InternalLayout>
  );
};

export default ExpiryAlertPage;
