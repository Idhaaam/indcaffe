import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Coffee, User, Lock, MapPin, Store } from 'lucide-react';
import api from '../api';

const RegisterCafePage = () => {
  const [formData, setFormData] = useState({
    username: '', password: '', name: '', city: '', address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setIsLoading(true);
    try {
      await api.post('/auth/register', { ...formData, type: 'CAFE' });
      setSuccess('Pendaftaran berhasil! Silakan login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal mendaftar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="split-layout">
      <div className="split-left">
        <div className="animate-fade-in" style={{ textAlign: 'center', zIndex: 10 }}>
          <Coffee size={80} color="white" style={{ marginBottom: '24px' }} />
          <h1 style={{ color: 'white', marginBottom: '16px' }}>Gabung Sebagai Café</h1>
          <p style={{ fontSize: '20px', color: 'var(--secondary-color)', opacity: 0.9 }}>
            Kurangi limbah makanan dan bantu mereka yang membutuhkan.
          </p>
        </div>
      </div>
      <div className="split-right" style={{ overflowY: 'auto' }}>
        <div style={{ maxWidth: '400px', width: '100%', margin: '40px auto' }} className="animate-fade-in">
          <h2>Daftar Akun Café</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Bergabunglah ke dalam jaringan IndCaffe</p>
          
          {error && <div style={{ padding: '12px', background: '#FFEBEE', color: '#C62828', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}
          {success && <div style={{ padding: '12px', background: '#E8F5E9', color: '#2E7D32', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{success}</div>}

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input type="text" className="form-input" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Nama Café</label>
              <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Kota</label>
              <input type="text" className="form-input" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Alamat Lengkap</label>
              <textarea className="form-input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required rows={3}></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '16px' }} disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Daftar Sebagai Café'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Sudah punya akun? <Link to="/login" style={{ color: 'var(--accent-green)', fontWeight: '600' }}>Login di sini</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCafePage;
