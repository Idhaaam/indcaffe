import React, { useState } from 'react';
import InternalLayout from '../components/InternalLayout';
import { Package, Search, Plus, Filter, Edit, Trash2, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import api from '../api';

const ProdukPage = () => {
  const { allProducts, fetchAllData, categories } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', categoryId: categories.length > 0 ? categories[0].id : '', currentStock: 0, unit: 'pcs', expiryDate: ''
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const cafeId = localStorage.getItem('cafeId');
      await api.post('/master/products', {
        name: formData.name,
        category: { id: parseInt(formData.categoryId) },
        cafe: { id: parseInt(cafeId) },
        currentStock: parseFloat(formData.currentStock),
        unit: formData.unit,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null
      });
      setShowModal(false);
      fetchAllData();
      setFormData({ name: '', categoryId: 1, currentStock: 0, unit: 'pcs', expiryDate: '' });
    } catch (err) {
      console.error(err);
      alert('Gagal menambah produk');
    }
  };

  return (
    <InternalLayout title="Dashboard / Produk">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Package size={28} color="var(--primary-color)" />
          <h2 style={{ margin: 0 }}>Manajemen Produk</h2>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Tambah Produk
        </button>
      </div>

      <div className="card" style={{ marginBottom: '24px', padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input type="text" className="form-input" placeholder="Cari nama produk..." style={{ paddingLeft: '44px', padding: '10px 16px 10px 44px' }} />
        </div>
        <button className="btn btn-secondary" style={{ padding: '10px 16px' }}><Filter size={18}/> Reset</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--primary-color)', color: 'white' }}>
              <th style={{ padding: '16px 24px' }}>ID</th>
              <th style={{ padding: '16px 24px' }}>Nama Produk</th>
              <th style={{ padding: '16px 24px' }}>Kategori</th>
              <th style={{ padding: '16px 24px' }}>Stok</th>
              <th style={{ padding: '16px 24px' }}>Satuan</th>
              <th style={{ padding: '16px 24px' }}>Status Stok</th>
            </tr>
          </thead>
          <tbody>
            {allProducts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#666' }}>Belum ada produk. Silakan tambah produk baru.</td>
              </tr>
            ) : allProducts.map((p, idx) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', background: p.currentStock <= 0 ? '#FFF8E1' : 'white' }}>
                <td style={{ padding: '16px 24px' }}>PRD-{p.id}</td>
                <td style={{ padding: '16px 24px', fontWeight: '500' }}>{p.name}</td>
                <td style={{ padding: '16px 24px' }}>{p.category ? p.category.name : '-'}</td>
                <td style={{ padding: '16px 24px' }}>{p.currentStock}</td>
                <td style={{ padding: '16px 24px' }}>{p.unit}</td>
                <td style={{ padding: '16px 24px' }}>
                  {p.currentStock > 5 ? <span className="badge badge-green">Aman</span> : 
                   p.currentStock > 0 ? <span className="badge badge-orange">Menipis</span> : 
                   <span className="badge" style={{ background: '#E0E0E0', color: '#616161' }}>Habis</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Tambah Produk Baru</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Nama Produk</label>
                  <input type="text" className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Kategori</label>
                  <select className="form-input" required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                    {categories.length === 0 && <option value="">Tidak ada kategori</option>}
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Stok Awal</label>
                  <input type="number" className="form-input" required value={formData.currentStock} onChange={e => setFormData({...formData, currentStock: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Satuan</label>
                  <input type="text" className="form-input" placeholder="kg, liter, pcs" required value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tanggal Kedaluwarsa (Opsional)</label>
                <input type="datetime-local" className="form-input" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>Simpan Produk</button>
            </form>
          </div>
        </div>
      )}
    </InternalLayout>
  );
};

export default ProdukPage;
