import React, { useState } from 'react';
import InternalLayout from '../components/InternalLayout';
import { AlertTriangle, Megaphone, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import api from '../api';

const ExpiryAlertPage = () => {
  const { expiryAlerts, fetchAllData } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    quantity: '',
    price: '',
    expiryDate: ''
  });

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      quantity: product.currentStock,
      price: '',
      expiryDate: product.expiryDate ? product.expiryDate.substring(0, 16) : ''
    });
    setShowModal(true);
  };

  const handlePostSurplus = async (e) => {
    e.preventDefault();
    try {
      const cafeId = localStorage.getItem('cafeId');
      await api.post('/transactions/surplus', {
        product: { id: selectedProduct.id },
        cafe: { id: parseInt(cafeId) },
        quantity: parseFloat(formData.quantity),
        price: parseFloat(formData.price || 0),
        expiryDate: new Date(formData.expiryDate).toISOString()
      });
      setShowModal(false);
      fetchAllData();
      alert('Produk berhasil diposting sebagai surplus!');
    } catch (err) {
      console.error(err);
      alert('Gagal memposting surplus');
    }
  };

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
            <p style={{ margin: 0, color: '#C62828', fontWeight: '500' }}>⚠️ {expiryAlerts.length} produk akan kadaluarsa dalam waktu dekat! Segera posting sebagai surplus sebelum terlambat.</p>
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
                      <button className="btn" style={{ padding: '8px 12px', background: 'var(--accent-orange)', color: 'white' }} onClick={() => handleOpenModal(product)}><Megaphone size={14}/> Post Surplus</button>
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

      {showModal && selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Jual Surplus: {selectedProduct.name}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
            </div>
            <form onSubmit={handlePostSurplus}>
              <div className="form-group">
                <label className="form-label">Jumlah Dijual (Maks: {selectedProduct.currentStock} {selectedProduct.unit})</label>
                <input type="number" className="form-input" required min="1" max={selectedProduct.currentStock} step="0.1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Harga Satuan (Rp)</label>
                <input type="number" className="form-input" required min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Tanggal Kadaluarsa Baru</label>
                <input type="datetime-local" className="form-input" required value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px', background: 'var(--accent-orange)', borderColor: 'var(--accent-orange)' }}>Post ke Etalase Surplus</button>
            </form>
          </div>
        </div>
      )}
    </InternalLayout>
  );
};

export default ExpiryAlertPage;
