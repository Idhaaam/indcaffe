import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartHandshake, User, Lock, MapPin, Building } from 'lucide-react';

const RegisterMitraPage = () => {
  const [formData, setFormData] = useState({
    username: '', password: '', name: '', city: '', organizationType: 'Panti Asuhan'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const res = await fetch('http://localhost:8081/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'MITRA' })
      });
      const data = await res.text();
      if (!res.ok) throw new Error(data || 'Gagal mendaftar');
      setSuccess('Pendaftaran berhasil! Silakan login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="split-layout">
      <div className="split-left" style={{ background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)' }}>
        <div className="animate-fade-in" style={{ textAlign: 'center', zIndex: 10 }}>
          <HeartHandshake size={80} color="white" style={{ marginBottom: '24px' }} />
          <h1 style={{ color: 'white', marginBottom: '16px' }}>Gabung Sebagai Mitra</h1>
          <p style={{ fontSize: '20px', color: '#BBDEFB', opacity: 0.9 }}>
            Jadilah jembatan kebaikan untuk menyalurkan makanan berlebih.
          </p>
        </div>
      </div>
      <div className="split-right" style={{ overflowY: 'auto' }}>
        <div style={{ maxWidth: '400px', width: '100%', margin: '40px auto' }} className="animate-fade-in">
          <h2>Daftar Akun Mitra</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Dapatkan akses ke donasi makanan berkualitas</p>
          
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
              <label className="form-label">Nama Organisasi / Yayasan</label>
              <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Jenis Organisasi</label>
              <select className="form-input" value={formData.organizationType} onChange={e => setFormData({...formData, organizationType: e.target.value})}>
                <option value="Panti Asuhan">Panti Asuhan</option>
                <option value="Panti Jompo">Panti Jompo</option>
                <option value="Komunitas Sosial">Komunitas Sosial</option>
                <option value="Organisasi Mahasiswa">Organisasi Mahasiswa</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Kota</label>
              <input type="text" className="form-input" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px', background: '#1976D2', borderColor: '#1976D2' }}>Daftar Sebagai Mitra</button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Sudah punya akun? <Link to="/login" style={{ color: '#1976D2', fontWeight: '600' }}>Login di sini</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterMitraPage;
