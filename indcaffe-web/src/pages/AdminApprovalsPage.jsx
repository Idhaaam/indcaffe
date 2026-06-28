import React, { useState, useEffect } from 'react';
import InternalLayout from '../components/InternalLayout';
import { UserPlus, CheckCircle, XCircle, Search } from 'lucide-react';
import api from '../api';

const AdminApprovalsPage = () => {
  const [approvals, setApprovals] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      // Format data: we need those who are not approved
      const mapped = res.data.map(u => ({
        id: u.id,
        name: u.username,
        email: u.email,
        type: u.role,
        date: u.date || new Date().toLocaleDateString(),
        status: u.isApproved ? 'Approved' : 'Pending'
      }));
      setApprovals(mapped);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleAction = async (id, newStatus) => {
    if (window.confirm(`Apakah Anda yakin ingin melakukan ${newStatus} pada akun ini?`)) {
      try {
        if (newStatus === 'Approved') {
          await api.put(`/admin/users/${id}/approve`);
        }
        setApprovals(approvals.map(a => a.id === id ? { ...a, status: newStatus } : a));
        alert(`Akun berhasil di-${newStatus}!`);
      } catch (err) {
        alert('Gagal melakukan aksi.');
      }
    }
  };

  const filteredApprovals = approvals.filter(a => 
    (filter === 'All' || a.status === filter) && 
    (a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <InternalLayout title="Super Admin / Persetujuan Akun">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <UserPlus size={28} color="var(--accent-orange)" />
        <h2 style={{ margin: 0 }}>Persetujuan Pendaftaran Akun</h2>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ flex: 1, minWidth: '250px', marginBottom: 0, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Cari nama atau email..." 
            style={{ paddingLeft: '40px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
            <button 
              key={f}
              className={`btn ${filter === f ? 'btn-primary' : ''}`}
              style={filter !== f ? { background: 'var(--bg-secondary)', color: 'var(--text-primary)' } : {}}
              onClick={() => setFilter(f)}
            >
              {f === 'All' ? 'Semua' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--primary-color)', color: 'white' }}>
              <th style={{ padding: '16px 24px' }}>Tanggal</th>
              <th style={{ padding: '16px 24px' }}>Nama Akun</th>
              <th style={{ padding: '16px 24px' }}>Email</th>
              <th style={{ padding: '16px 24px' }}>Tipe</th>
              <th style={{ padding: '16px 24px' }}>Status</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredApprovals.length > 0 ? filteredApprovals.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{item.date}</td>
                <td style={{ padding: '16px 24px', fontWeight: '600' }}>{item.name}</td>
                <td style={{ padding: '16px 24px' }}>{item.email}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span className="badge" style={{ background: item.type === 'CAFE' ? '#E3F2FD' : '#F3E5F5', color: item.type === 'CAFE' ? '#1565C0' : '#7B1FA2' }}>
                    {item.type}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span className={`badge ${item.status === 'Pending' ? 'badge-orange' : (item.status === 'Approved' ? 'badge-green' : 'badge-red')}`}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  {item.status === 'Pending' && (
                    <>
                      <button onClick={() => handleAction(item.id, 'Approved')} className="btn" style={{ padding: '6px 12px', background: 'var(--accent-green)', color: 'white', display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button onClick={() => handleAction(item.id, 'Rejected')} className="btn" style={{ padding: '6px 12px', background: 'var(--accent-red)', color: 'white', display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <XCircle size={14} /> Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Tidak ada data pendaftar ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </InternalLayout>
  );
};

export default AdminApprovalsPage;
