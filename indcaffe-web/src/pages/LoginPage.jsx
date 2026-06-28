import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Coffee, User, Lock, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Login gagal.');
      }
      
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
      setError(err.message || 'Terjadi kesalahan jaringan.');
    }
  };

  return (
    <div className="split-layout">
      {/* Left Branding Column */}
      <div className="split-left">
        <div className="animate-fade-in" style={{ textAlign: 'center', zIndex: 10 }}>
          <Coffee size={80} color="white" style={{ marginBottom: '24px' }} />
          <h1 style={{ color: 'white', marginBottom: '16px' }}>IndCaffe</h1>
          <p style={{ fontSize: '24px', fontStyle: 'italic', color: 'var(--secondary-color)', opacity: 0.9 }}>
            "Save Food, Save Earth"
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '60px' }}>
            <div style={{ opacity: 0.8 }}>
              <h3 style={{ color: 'white', margin: 0 }}>2,350 kg</h3>
              <p>Makanan Diselamatkan</p>
            </div>
            <div style={{ opacity: 0.8 }}>
              <h3 style={{ color: 'white', margin: 0 }}>48</h3>
              <p>Café Bergabung</p>
            </div>
            <div style={{ opacity: 0.8 }}>
              <h3 style={{ color: 'white', margin: 0 }}>125</h3>
              <p>Mitra Aktif</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form Column */}
      <div className="split-right">
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }} className="animate-fade-in">
          <h2>Selamat Datang Kembali</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Masuk ke akun IndCaffe Anda</p>
          
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
              />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Petunjuk: Ketik "admin" atau "mitra"</span>
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="form-input" 
                  placeholder="••••••••" 
                  style={{ paddingLeft: '48px', paddingRight: '48px' }} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input type="checkbox" /> Ingat Saya
              </label>
              <Link to="#" style={{ fontSize: '13px', color: 'var(--accent-green)' }}>Lupa Password?</Link>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Masuk Sekarang
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '32px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
            <span style={{ padding: '0 16px', color: 'var(--text-secondary)' }}>atau</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          </div>

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
