import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Coffee, User, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../api';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { username, password });
      const data = res.data;
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('username', data.username);
      localStorage.setItem('userId', data.id);
      localStorage.setItem('name', data.name || '');
      localStorage.setItem('city', data.city || '');
      localStorage.setItem('address', data.address || '');
      
      if (data.cafeId) {
         localStorage.setItem('cafeId', data.cafeId);
      }
      if (data.mitraId) {
        localStorage.setItem('mitraId', data.mitraId);
      }
      
      if (data.role === 'CAFE') {
        navigate('/dashboard');
      } else if (data.role === 'MITRA') {
        navigate('/mitra-donasi');
      } else if (data.role === 'ADMIN') {
        navigate('/admin/users');
      } else if (data.role === 'PELANGGAN') {
        navigate('/store');
      } else {
        setError('Role tidak dikenali.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Terjadi kesalahan jaringan.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F8F9FA' }}>
      {/* Left section - Branding */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, var(--primary-color) 0%, #155e40 100%)', display: 'flex', flexDirection: 'column', padding: '40px', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
        <div style={{ position: 'absolute', bottom: '-5%', left: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
        
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'white', zIndex: 1 }}>
          <div style={{ background: 'white', color: 'var(--primary-color)', padding: '8px', borderRadius: '8px' }}>
            <Coffee size={24} />
          </div>
          <h2 style={{ margin: 0, fontSize: '24px' }}>IndCaffe</h2>
        </Link>
        
        <div style={{ marginTop: 'auto', marginBottom: 'auto', zIndex: 1, maxWidth: '400px' }}>
          <h1 style={{ fontSize: '42px', lineHeight: 1.2, marginBottom: '24px' }}>Selamat Datang Kembali</h1>
          <p style={{ fontSize: '18px', opacity: 0.9, lineHeight: 1.6 }}>Lanjutkan kontribusi Anda dalam membangun ekosistem kopi berkelanjutan bersama IndCaffe.</p>
        </div>
      </div>

      {/* Right section - Login Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', marginBottom: '8px' }}>Masuk ke Akun</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Silakan masukkan username dan password Anda</p>
          
          {error && <div style={{ padding: '12px', background: '#FFEBEE', color: '#C62828', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Username / Email</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="contoh: admin" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required 
                disabled={isLoading}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Petunjuk: Ketik "admin" atau "mitra"</span>
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="form-input" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <a href="#" style={{ color: 'var(--primary-color)', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}>Lupa Password?</a>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }} disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Masuk Sekarang'}
            </button>
          </form>


          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Belum punya akun?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
              <Link to="/register-cafe" style={{ color: 'var(--accent-green)', fontWeight: '600' }}>Daftar Café</Link>
              <span style={{ color: 'var(--border-color)' }}>|</span>
              <Link to="/register-mitra" style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>Daftar Mitra</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
