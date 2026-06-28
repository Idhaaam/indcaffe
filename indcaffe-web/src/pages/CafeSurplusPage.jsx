import React, { useState, useEffect } from 'react';
import { Store, Search, Filter } from 'lucide-react';
import InternalLayout from '../components/InternalLayout';
import api from '../api';

const CafeSurplusPage = () => {
  const [surplusPosts, setSurplusPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMySurplus();
  }, []);

  const fetchMySurplus = async () => {
    try {
      setLoading(true);
      const cafeId = localStorage.getItem('cafeId');
      if (cafeId && cafeId !== 'null') {
        const res = await api.get(`/transactions/surplus/cafe/${cafeId}`);
        setSurplusPosts(res.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data surplus:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = surplusPosts.filter(p => 
    p.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <InternalLayout title="Dashboard / Surplus Aktif">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Store size={28} color="var(--primary-color)" />
          <h2 style={{ margin: 0 }}>Etalase Surplus Anda</h2>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px', padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Cari nama produk surplus..." 
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
              <th style={{ padding: '16px 24px' }}>Produk</th>
              <th style={{ padding: '16px 24px' }}>Kategori</th>
              <th style={{ padding: '16px 24px' }}>Jumlah Dijual</th>
              <th style={{ padding: '16px 24px' }}>Harga Surplus</th>
              <th style={{ padding: '16px 24px' }}>Tanggal Exp</th>
              <th style={{ padding: '16px 24px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ padding: '24px', textAlign: 'center', color: '#666' }}>Memuat data...</td>
              </tr>
            ) : filteredPosts.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: '24px', textAlign: 'center', color: '#666' }}>Anda belum memposting produk surplus apa pun.</td>
              </tr>
            ) : filteredPosts.map((sp) => (
              <tr key={sp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px 24px' }}>SPL-{sp.id}</td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {sp.product?.imageUrl ? (
                      <img src={sp.product.imageUrl.startsWith('http') ? sp.product.imageUrl : `http://localhost:8081${sp.product.imageUrl}`} alt={sp.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '10px', color: '#888' }}>No Image</span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '16px 24px', fontWeight: '500' }}>{sp.product?.name}</td>
                <td style={{ padding: '16px 24px' }}>{sp.product?.category?.name || '-'}</td>
                <td style={{ padding: '16px 24px' }}>{sp.quantity} {sp.product?.unit}</td>
                <td style={{ padding: '16px 24px' }}>Rp {sp.price?.toLocaleString('id-ID')}</td>
                <td style={{ padding: '16px 24px', color: '#C62828' }}>
                  {new Date(sp.expiryDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  {sp.status === 'TERSEDIA' ? <span className="badge badge-green">Tersedia</span> : 
                   sp.status === 'DIKLAIM' ? <span className="badge badge-orange">Dipesan</span> : 
                   <span className="badge" style={{ background: '#E0E0E0', color: '#616161' }}>{sp.status}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </InternalLayout>
  );
};

export default CafeSurplusPage;
