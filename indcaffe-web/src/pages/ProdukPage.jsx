import React, { useState } from 'react';
import { Package, Plus, Search, Edit2, Trash2, X, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import InternalLayout from '../components/InternalLayout';
import { useAppContext } from '../context/AppContext';
import EmptyState from '../components/EmptyState';
import api from '../api';

const ProdukPage = () => {
  const { allProducts, fetchAllData, categories } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '', description: '', categoryId: '', price: '', currentStock: '', unit: 'pcs', expiryDate: '', isActive: true
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  React.useEffect(() => {
    if (categories.length > 0 && !formData.categoryId) {
      setFormData(prev => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      let uploadedUrl = null;
      if (selectedFile) {
        const fileData = new FormData();
        fileData.append('file', selectedFile);
        const uploadRes = await api.post('/upload/image', fileData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedUrl = uploadRes.data.url;
      }

      const cafeId = localStorage.getItem('cafeId');
      await api.post('/master/products', {
        name: formData.name,
        description: formData.description,
        category: { id: parseInt(formData.categoryId) },
        cafe: { id: parseInt(cafeId) },
        currentStock: parseFloat(formData.currentStock || 0),
        unit: formData.unit,
        price: parseFloat(formData.price || 0),
        isActive: formData.isActive,
        expiryDate: formData.expiryDate ? formData.expiryDate.split('T')[0] : null,
        imageUrl: uploadedUrl
      });
      setShowModal(false);
      fetchAllData();
      setFormData({ name: '', description: '', categoryId: categories.length > 0 ? categories[0].id : '', price: '', currentStock: '', unit: 'pcs', expiryDate: '', isActive: true });
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      alert('Gagal menambah produk');
    }
  };

  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <input 
            type="text" 
            className="form-input" 
            placeholder="Cari nama produk..." 
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

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--primary-color)', color: 'white' }}>
              <th style={{ padding: '16px 24px' }}>ID</th>
              <th style={{ padding: '16px 24px', width: '60px' }}>Foto</th>
              <th style={{ padding: '16px 24px' }}>Nama Produk</th>
              <th style={{ padding: '16px 24px' }}>Kategori</th>
              <th style={{ padding: '16px 24px' }}>Stok</th>
              <th style={{ padding: '16px 24px' }}>Satuan</th>
              <th style={{ padding: '16px 24px' }}>Status Stok</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: '#666' }}>Tidak ada produk yang cocok dengan pencarian Anda.</td>
              </tr>
            ) : filteredProducts.map((p, idx) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', background: p.currentStock <= 0 ? 'var(--bg-color, #FFF8E1)' : 'var(--card-bg, white)' }}>
                <td style={{ padding: '16px 24px' }}>PRD-{p.id}</td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.imageUrl ? (
                      <img src={p.imageUrl.startsWith('http') ? p.imageUrl : `http://localhost:8081${p.imageUrl}`} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '10px', color: '#888' }}>No Image</span>
                    )}
                  </div>
                </td>
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(19, 27, 46, 0.4)', backdropFilter: 'blur(12px)', padding: '20px', overflowY: 'auto' }}>
          <div style={{ backgroundColor: 'var(--card-bg, #ffffff)', width: '100%', maxWidth: '896px', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color, #e2e8f0)', maxHeight: '95vh', margin: 'auto' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color, #e2e8f0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={24} />
                </div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: 'var(--text-primary, #1e293b)' }}>Tambah Produk Baru</h2>
              </div>
              <button type="button" onClick={() => setShowModal(false)} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary, #64748b)', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px', overflowY: 'auto' }}>
              <form id="addProductForm" onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary, #475569)' }}>Nama Produk</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Contoh: Laptop Pro X15 Core i9" style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)', backgroundColor: 'var(--bg-color, #ffffff)', color: 'var(--text-primary, #1e293b)', fontSize: '14px', outline: 'none' }} onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = 'var(--border-color, #cbd5e1)'} />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary, #475569)' }}>Kategori</label>
                    <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)', backgroundColor: 'var(--bg-color, #ffffff)', color: 'var(--text-primary, #1e293b)', fontSize: '14px', outline: 'none' }} onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = 'var(--border-color, #cbd5e1)'}>
                      <option disabled value="">Pilih Kategori Produk</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary, #475569)' }}>Deskripsi Produk</label>
                    <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Berikan detail spesifikasi atau keterangan produk secara lengkap..." style={{ width: '100%', minHeight: '120px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)', backgroundColor: 'var(--bg-color, #ffffff)', color: 'var(--text-primary, #1e293b)', fontSize: '14px', outline: 'none', resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = 'var(--border-color, #cbd5e1)'}></textarea>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary, #475569)' }}>Harga Jual</label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <span style={{ position: 'absolute', left: '12px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary, #475569)' }}>Rp</span>
                        <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0" style={{ width: '100%', height: '44px', padding: '0 12px 0 40px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)', backgroundColor: 'var(--bg-color, #ffffff)', color: 'var(--text-primary, #1e293b)', fontSize: '14px', outline: 'none' }} onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = 'var(--border-color, #cbd5e1)'} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary, #475569)' }}>Status Produk</label>
                      <select required value={formData.isActive ? 'active' : 'inactive'} onChange={e => setFormData({...formData, isActive: e.target.value === 'active'})} style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)', backgroundColor: 'var(--bg-color, #ffffff)', color: 'var(--text-primary, #1e293b)', fontSize: '14px', outline: 'none' }} onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = 'var(--border-color, #cbd5e1)'}>
                        <option value="active">Aktif</option>
                        <option value="inactive">Tidak Aktif</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary, #475569)' }}>Stok Awal</label>
                      <input type="number" required value={formData.currentStock} onChange={e => setFormData({...formData, currentStock: e.target.value})} placeholder="0" style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)', backgroundColor: 'var(--bg-color, #ffffff)', color: 'var(--text-primary, #1e293b)', fontSize: '14px', outline: 'none' }} onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = 'var(--border-color, #cbd5e1)'} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary, #475569)' }}>Satuan</label>
                      <input type="text" required value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} placeholder="Pcs, Unit, Box" style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)', backgroundColor: 'var(--bg-color, #ffffff)', color: 'var(--text-primary, #1e293b)', fontSize: '14px', outline: 'none' }} onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = 'var(--border-color, #cbd5e1)'} />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary, #475569)' }}>Tanggal Kedaluwarsa (Opsional)</label>
                    <input type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--border-color, #cbd5e1)', backgroundColor: 'var(--bg-color, #ffffff)', color: 'var(--text-primary, #1e293b)', fontSize: '14px', outline: 'none' }} onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = 'var(--border-color, #cbd5e1)'} />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary, #475569)' }}>Foto Produk</label>
                    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {!previewUrl ? (
                        <div style={{ border: '2px dashed var(--border-color, #cbd5e1)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.02)', cursor: 'pointer', minHeight: '260px', flex: 1, transition: 'all 0.2s' }} onClick={() => document.getElementById('image-upload').click()} onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.05)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color, #cbd5e1)'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)'; }}>
                          <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--text-secondary, #64748b)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                            <ImageIcon size={36} />
                          </div>
                          <p style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-primary, #1e293b)', margin: '0 0 8px 0', textAlign: 'center' }}>Klik atau tarik gambar ke sini</p>
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary, #64748b)', margin: 0, textAlign: 'center' }}>Format PNG, JPG atau WEBP (Maks. 5MB)</p>
                          <input id="image-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                        </div>
                      ) : (
                        <div style={{ borderRadius: '12px', border: '1px solid var(--border-color, #cbd5e1)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, backgroundColor: 'rgba(0,0,0,0.02)', position: 'relative', minHeight: '260px' }}>
                          <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                          <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderTop: '1px solid var(--border-color, #cbd5e1)' }}>
                            <div style={{ overflow: 'hidden', flex: 1, paddingRight: '16px' }}>
                              <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary, #1e293b)', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedFile ? selectedFile.name : 'image.jpg'}</p>
                              <p style={{ fontSize: '12px', color: 'var(--text-secondary, #64748b)', margin: 0 }}>{selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB' : 'Preview'}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button type="button" onClick={() => document.getElementById('image-upload').click()} style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '6px', color: '#2563eb', backgroundColor: 'rgba(37, 99, 235, 0.1)', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', fontSize: '13px', fontWeight: '500' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.2)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.1)'} title="Ganti Gambar">
                                <Edit2 size={16} /> Ganti
                              </button>
                              <button type="button" onClick={handleRemoveImage} style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '6px', color: '#ba1a1a', backgroundColor: 'rgba(186, 26, 26, 0.1)', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', fontSize: '13px', fontWeight: '500' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(186, 26, 26, 0.2)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(186, 26, 26, 0.1)'} title="Hapus">
                                <Trash2 size={16} /> Hapus
                              </button>
                              <input id="image-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color, #e2e8f0)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', backgroundColor: 'rgba(0,0,0,0.01)', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 24px', borderRadius: '8px', fontWeight: '500', border: '1px solid var(--border-color, #cbd5e1)', color: 'var(--text-secondary, #475569)', backgroundColor: 'transparent', cursor: 'pointer', transition: 'background-color 0.2s', height: '44px', fontSize: '14px' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                Batal
              </button>
              <button type="submit" form="addProductForm" style={{ padding: '8px 24px', borderRadius: '8px', fontWeight: '500', backgroundColor: '#004ac6', color: '#ffffff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background-color 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: '44px', fontSize: '14px' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2563eb'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#004ac6'}>
                <Plus size={20} />
                Simpan Produk
              </button>
            </div>
            
          </div>
        </div>
      )}
    </InternalLayout>
  );
};

export default ProdukPage;
