import React, { useState, useEffect } from 'react';
import InternalLayout from '../components/InternalLayout';
import { Users, Search, Ban, CheckCircle, ShieldAlert } from 'lucide-react';
import api from '../api';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      // Format data: we need approved users or all users depending on admin needs
      const mapped = res.data.map(u => ({
        id: u.id,
        name: u.username,
        email: u.email,
        role: u.role,
        status: u.isActive ? 'Aktif' : 'Suspended'
      }));
      setUsers(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Aktif' ? 'Suspended' : 'Aktif';
    let confirmMsg = currentStatus === 'Aktif' 
      ? 'Apakah Anda yakin ingin menangguhkan (suspend) pengguna ini? Mereka tidak akan bisa login ke dalam sistem.' 
      : 'Apakah Anda yakin ingin mengaktifkan kembali pengguna ini?';
      
    if (window.confirm(confirmMsg)) {
      try {
        await api.put(`/admin/users/${id}/toggle-status`);
        setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
        alert(`Pengguna berhasil di-${newStatus}!`);
      } catch (err) {
        alert('Gagal merubah status pengguna.');
      }
    }
  };

  const filteredUsers = users.filter(u => 
    (filter === 'All' || u.role === filter) && 
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <InternalLayout title="Super Admin / Manajemen Pengguna">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Users size={28} color="var(--accent-orange)" />
        <h2 style={{ margin: 0 }}>Manajemen Pengguna (User Management)</h2>
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
          {['All', 'CAFE', 'MITRA', 'PELANGGAN'].map(f => (
            <button 
              key={f}
              className={`btn ${filter === f ? 'btn-primary' : ''}`}
              style={filter !== f ? { background: 'var(--bg-secondary)', color: 'var(--text-primary)' } : {}}
              onClick={() => setFilter(f)}
            >
              {f === 'All' ? 'Semua Role' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--primary-color)', color: 'white' }}>
              <th style={{ padding: '16px 24px' }}>ID Pengguna</th>
              <th style={{ padding: '16px 24px' }}>Nama Lengkap</th>
              <th style={{ padding: '16px 24px' }}>Email</th>
              <th style={{ padding: '16px 24px' }}>Role</th>
              <th style={{ padding: '16px 24px' }}>Status Akun</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? filteredUsers.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)', background: user.status === 'Suspended' ? '#FFEBEE' : 'transparent' }}>
                <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>UID-{1000 + user.id}</td>
                <td style={{ padding: '16px 24px', fontWeight: '600' }}>{user.name}</td>
                <td style={{ padding: '16px 24px' }}>{user.email}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span className="badge" style={{ background: user.role === 'CAFE' ? '#E3F2FD' : (user.role === 'MITRA' ? '#F3E5F5' : '#FFF3E0'), color: user.role === 'CAFE' ? '#1565C0' : (user.role === 'MITRA' ? '#7B1FA2' : '#E65100') }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span className={`badge ${user.status === 'Aktif' ? 'badge-green' : 'badge-red'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {user.status === 'Aktif' ? <CheckCircle size={12} /> : <ShieldAlert size={12} />}
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => handleToggleStatus(user.id, user.status)} 
                    className="btn" 
                    style={{ 
                      padding: '6px 12px', 
                      background: user.status === 'Aktif' ? '#FFEBEE' : '#E8F5E9', 
                      color: user.status === 'Aktif' ? '#C62828' : '#2E7D32', 
                      display: 'flex', gap: '4px', alignItems: 'center' 
                    }}
                  >
                    {user.status === 'Aktif' ? <><Ban size={14} /> Suspend</> : <><CheckCircle size={14} /> Aktifkan</>}
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Tidak ada pengguna yang cocok dengan pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </InternalLayout>
  );
};

export default AdminUsersPage;
