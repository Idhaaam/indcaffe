import React, { useState } from 'react';
import InternalLayout from '../components/InternalLayout';
import { Inbox, Search, Plus, Filter, Download, Edit2, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import EmptyState from '../components/EmptyState';

const StokMasukPage = () => {
  const { products } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <InternalLayout title="Dashboard / Stok Masuk">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Inbox size={28} color="var(--accent-green)" />
          <h2 style={{ margin: 0 }}>Transaksi Stok Masuk</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}><Download size={18} /> Export CSV</button>
          <button className="btn btn-primary"><Plus size={18} /> Catat Stok Masuk</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px', padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <input type="date" className="form-input" style={{ width: 'auto', padding: '10px 16px' }} />
        <span style={{ color: 'var(--text-secondary)' }}>-</span>
        <input type="date" className="form-input" style={{ width: 'auto', padding: '10px 16px' }} />
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Cari produk..." 
            style={{ paddingLeft: '44px', padding: '10px 16px 10px 44px' }} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary" style={{ padding: '10px 16px' }}><Filter size={18}/> Filter</button>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState title="Tidak Ada Stok" message="Anda belum menambahkan produk ke dalam sistem atau tidak ada produk yang cocok dengan pencarian Anda." />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F5F5F5', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: '600' }}>Nama Produk</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: '600' }}>Kategori</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: '600' }}>Batas Waktu</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: '600' }}>Sisa</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px', fontWeight: '500' }}>{product.name}</td>
                  <td style={{ padding: '16px 24px' }}>{product.category}</td>
                  <td style={{ padding: '16px 24px' }}>{product.expiry}</td>
                  <td style={{ padding: '16px 24px' }}><strong>{product.sisa}</strong></td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={`badge ${product.status === 'Tersedia' ? 'badge-green' : product.status === 'Hampir Habis' ? 'badge-orange' : 'badge-blue'}`}>{product.status}</span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button className="btn btn-secondary" style={{ padding: '8px', color: 'var(--accent-blue)', borderColor: 'var(--accent-blue)' }}><Edit2 size={16} /></button>
                      <button className="btn btn-secondary" style={{ padding: '8px', color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </InternalLayout>
  );
};

export default StokMasukPage;
