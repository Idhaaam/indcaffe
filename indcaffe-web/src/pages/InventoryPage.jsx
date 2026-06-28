import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Filter, X } from 'lucide-react';
import InternalLayout from '../components/InternalLayout';
import api from '../api';

const categories = ["Semua", "Minuman", "Roti", "Kue", "Makanan"];

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [filterCat, setFilterCat] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Modal Form State
  const [formData, setFormData] = useState({ productId: '', type: 'INCOMING', quantity: 1 });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/warehouse/inventory');
      setInventory(response.data || []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return <span className="badge" style={{ background: '#fee2e2', color: '#ef4444', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>Habis</span>;
    if (stock <= 5) return <span className="badge" style={{ background: '#fef3c7', color: '#d97706', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>Menipis</span>;
    return <span className="badge" style={{ background: '#d1fae5', color: '#10b981', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>Cukup</span>;
  };

  const filteredInventory = inventory.filter(item => {
    if (filterCat === "Semua") return true;
    const cat = item.product?.category || item.category;
    return cat === filterCat;
  });

  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/warehouse/inventory', {
        productId: parseInt(formData.productId),
        type: formData.type,
        quantity: parseInt(formData.quantity)
      });
      setIsModalOpen(false);
      setFormData({ productId: '', type: 'INCOMING', quantity: 1 });
      fetchInventory();
    } catch (error) {
      console.error("Error adding inventory:", error);
      alert("Gagal mencatat barang");
    }
  };

  return (
    <InternalLayout title="Manajemen Inventori Gudang">
      <div className="inventory-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Top Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #ddd', borderRadius: '4px', padding: '0 10px' }}>
              <Filter size={16} color="#666" />
              <select 
                value={filterCat} 
                onChange={(e) => setFilterCat(e.target.value)}
                style={{ border: 'none', padding: '10px', outline: 'none', background: 'transparent' }}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            <PlusCircle size={18} /> Catat Barang
          </button>
        </div>

        {/* Inventory Table */}
        <div className="card" style={{ border: '1px solid #ddd', borderRadius: '8px', overflowX: 'auto', background: 'white' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '12px 15px', fontWeight: '600', color: '#374151' }}>Nama Produk</th>
                <th style={{ padding: '12px 15px', fontWeight: '600', color: '#374151' }}>Kategori</th>
                <th style={{ padding: '12px 15px', fontWeight: '600', color: '#374151' }}>Masuk</th>
                <th style={{ padding: '12px 15px', fontWeight: '600', color: '#374151' }}>Keluar</th>
                <th style={{ padding: '12px 15px', fontWeight: '600', color: '#374151' }}>Stok Akhir</th>
                <th style={{ padding: '12px 15px', fontWeight: '600', color: '#374151' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Memuat data...</td></tr>
              ) : filteredInventory.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Tidak ada data.</td></tr>
              ) : (
                filteredInventory.map((item, idx) => {
                  const prodName = item.product?.name || item.name || `Produk #${item.product?.id || item.productId || 'Unknown'}`;
                  const prodCat = item.product?.category || item.category || '-';
                  return (
                    <tr key={item.id || idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 15px' }}>{prodName}</td>
                      <td style={{ padding: '12px 15px' }}>{prodCat}</td>
                      <td style={{ padding: '12px 15px' }}>{item.inQty || 0}</td>
                      <td style={{ padding: '12px 15px' }}>{item.outQty || 0}</td>
                      <td style={{ padding: '12px 15px', fontWeight: 'bold' }}>{item.stock !== undefined ? item.stock : 0}</td>
                      <td style={{ padding: '12px 15px' }}>{getStockBadge(item.stock !== undefined ? item.stock : 0)}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ background: 'white', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Catat Barang</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#666" /></button>
            </div>
            
            <form onSubmit={handleAddInventory} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px' }}>ID Produk</label>
                <input type="number" min="1" className="form-input" required value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }} placeholder="Masukkan ID Produk" />
              </div>
              
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px' }}>Tipe Transaksi</label>
                <select className="form-input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="INCOMING">Barang Masuk (INCOMING)</option>
                  <option value="OUTGOING">Barang Keluar (OUTGOING)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px' }}>Jumlah</label>
                <input type="number" min="1" className="form-input" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </InternalLayout>
  );
}
