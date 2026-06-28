import React, { useState, useEffect } from 'react';
import InternalLayout from '../components/InternalLayout';
import { Inbox, Search, Plus, X, Filter } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import EmptyState from '../components/EmptyState';
import api from '../api';

const StokMasukPage = () => {
  const { allProducts } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    notes: ''
  });

  const fetchTransactions = async () => {
    try {
      const cafeId = localStorage.getItem('cafeId');
      if (cafeId && cafeId !== 'null') {
        const res = await api.get(`/transactions/cafe/${cafeId}`);
        setTransactions(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions/', {
        product: { id: parseInt(formData.productId) },
        type: 'INCOMING',
        quantity: parseFloat(formData.quantity),
        notes: formData.notes
      });
      setShowModal(false);
      setFormData({ productId: '', quantity: '', notes: '' });
      fetchTransactions();
      alert('Stok berhasil ditambahkan!');
    } catch (err) {
      console.error(err);
      alert('Gagal menambah stok');
    }
  };

  const filteredTransactions = transactions.filter(t => 
    t.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <InternalLayout title="Dashboard / Stok Masuk">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Inbox size={28} color="var(--accent-green)" />
          <h2 style={{ margin: 0 }}>Transaksi Stok Masuk</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={18} /> Catat Stok Masuk</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px', padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Cari transaksi berdasarkan produk..." 
            style={{ paddingLeft: '44px', padding: '10px 16px 10px 44px' }} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery && (
          <button className="btn btn-secondary" style={{ padding: '10px 16px' }} onClick={() => setSearchQuery('')}>
            <Filter size={18}/> Reset
          </button>
        )}
      </div>

      {filteredTransactions.length === 0 ? (
        <EmptyState title="Tidak Ada Transaksi" message="Belum ada transaksi stok masuk yang dicatat atau cocok dengan pencarian Anda." />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F5F5F5', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: '600' }}>Waktu</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: '600' }}>Produk</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: '600' }}>Tipe</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: '600' }}>Jumlah</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: '600' }}>Catatan</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px' }}>{new Date(t.transactionDate).toLocaleString('id-ID')}</td>
                  <td style={{ padding: '16px 24px', fontWeight: '500' }}>{t.product?.name}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={t.type === 'INCOMING' ? 'badge badge-green' : 'badge badge-red'}>{t.type}</span>
                  </td>
                  <td style={{ padding: '16px 24px' }}><strong>{t.quantity}</strong> {t.product?.unit}</td>
                  <td style={{ padding: '16px 24px' }}>{t.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Catat Stok Masuk</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleAddStock}>
              <div className="form-group">
                <label className="form-label">Produk</label>
                <select className="form-input" required value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})}>
                  <option value="">-- Pilih Produk --</option>
                  {allProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Sisa: {p.currentStock})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Jumlah Masuk</label>
                <input type="number" className="form-input" required min="0.1" step="0.1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Catatan (Opsional)</label>
                <textarea className="form-input" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Misal: Stok dari supplier X"></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>Simpan Stok</button>
            </form>
          </div>
        </div>
      )}
    </InternalLayout>
  );
};

export default StokMasukPage;
