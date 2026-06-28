import React, { useState, useEffect } from 'react';
import InternalLayout from '../components/InternalLayout';
import { Tags, Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../api';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/master/categories');
      // Format data if needed
      setCategories(res.data.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description || 'Tidak ada deskripsi',
        count: c.productCount || 0,
        date: c.createdAt || new Date().toLocaleDateString()
      })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setFormData(cat);
    } else {
      setFormData({ id: null, name: '', description: '' });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/master/categories/${formData.id}`, formData);
        alert('Kategori berhasil diperbarui!');
      } else {
        await api.post('/master/categories', formData);
        alert('Kategori baru berhasil ditambahkan!');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      alert('Gagal menyimpan kategori');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini? Semua produk di dalamnya mungkin akan terdampak.')) {
      try {
        await api.delete(`/master/categories/${id}`);
        alert('Kategori berhasil dihapus!');
        fetchCategories();
      } catch (err) {
        alert('Gagal menghapus kategori');
      }
    }
  };

  return (
    <InternalLayout title="Super Admin / Master Kategori">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Tags size={28} color="var(--accent-orange)" />
          <h2 style={{ margin: 0 }}>Master Kategori Produk</h2>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Tambah Kategori
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--primary-color)', color: 'white' }}>
              <th style={{ padding: '16px 24px' }}>Nama Kategori</th>
              <th style={{ padding: '16px 24px' }}>Deskripsi</th>
              <th style={{ padding: '16px 24px' }}>Jml Produk</th>
              <th style={{ padding: '16px 24px' }}>Tgl Dibuat</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px 24px', fontWeight: '600' }}>{cat.name}</td>
                <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{cat.description}</td>
                <td style={{ padding: '16px 24px' }}><span className="badge badge-green">{cat.count} Item</span></td>
                <td style={{ padding: '16px 24px' }}>{cat.date}</td>
                <td style={{ padding: '16px 24px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button onClick={() => handleOpenModal(cat)} className="btn" style={{ padding: '6px', background: '#E3F2FD', color: '#1565C0' }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="btn" style={{ padding: '6px', background: '#FFEBEE', color: '#C62828' }}>
                    <Trash2 size={16} />
                  </button>
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
              <h3 style={{ margin: 0 }}>{formData.id ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Nama Kategori</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="Misal: Minuman Dingin"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Deskripsi</label>
                <textarea 
                  className="form-input" 
                  required 
                  rows="3"
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Deskripsi singkat mengenai kategori ini..."
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn" style={{ flex: 1, border: '1px solid var(--border-color)' }} onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan Kategori</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </InternalLayout>
  );
};

export default AdminCategoriesPage;
