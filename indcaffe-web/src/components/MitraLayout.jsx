import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Coffee, ShoppingCart, ClipboardList, ScrollText, User, LogOut, Bell, Moon, MessageCircle, Menu } from 'lucide-react';

const MitraLayout = ({ children, title }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    navigate('/login');
  };

  const username = localStorage.getItem('username') || 'Mitra';
  const mitraName = localStorage.getItem('name') || username;

  return (
    <div className="app-layout">
      {/* Mobile Overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

      {/* Sidebar Mitra */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ backgroundColor: 'var(--primary-color)' }}>
        <div style={{ padding: '0 24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Coffee color="var(--accent-green)" size={32} />
          <h2 style={{ color: 'white', margin: 0, fontSize: '24px' }}>IndCaffe</h2>
        </div>
        
        <div style={{ padding: '0 24px', marginBottom: '24px' }}>
          <p style={{ color: 'white', fontSize: '14px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>🤝 {mitraName}</p>
          <span style={{ fontSize: '12px', color: 'var(--accent-green)' }}>Mitra Penerima</span>
        </div>

        <nav>
          <ul style={{ padding: '0 12px' }}>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/mitra-donasi" style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                background: currentPath === '/mitra-donasi' ? 'rgba(255,255,255,0.2)' : 'transparent',
                borderLeft: currentPath === '/mitra-donasi' ? '3px solid white' : '3px solid transparent',
                color: 'white', borderRadius: '4px', opacity: currentPath === '/mitra-donasi' ? 1 : 0.8
              }}>
                <ShoppingCart size={20} /> Donasi Tersedia
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/mitra-klaim" style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                background: currentPath === '/mitra-klaim' ? 'rgba(255,255,255,0.2)' : 'transparent',
                borderLeft: currentPath === '/mitra-klaim' ? '3px solid white' : '3px solid transparent',
                color: 'white', borderRadius: '4px', opacity: currentPath === '/mitra-klaim' ? 1 : 0.8
              }}>
                <ClipboardList size={20} /> Klaim Saya
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/mitra-riwayat" style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                background: currentPath === '/mitra-riwayat' ? 'rgba(255,255,255,0.2)' : 'transparent',
                borderLeft: currentPath === '/mitra-riwayat' ? '3px solid white' : '3px solid transparent',
                color: 'white', borderRadius: '4px', opacity: currentPath === '/mitra-riwayat' ? 1 : 0.8
              }}>
                <ScrollText size={20} /> Riwayat Donasi
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/mitra-chat" style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                background: currentPath === '/mitra-chat' ? 'rgba(255,255,255,0.2)' : 'transparent',
                borderLeft: currentPath === '/mitra-chat' ? '3px solid white' : '3px solid transparent',
                color: 'white', borderRadius: '4px', opacity: currentPath === '/mitra-chat' ? 1 : 0.8
              }}>
                <MessageCircle size={20} /> Pesan
              </Link>
            </li>
            <li style={{ marginTop: 'auto', paddingTop: '24px' }}>
              <a href="#" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#FFCDD2' }}>
                <LogOut size={20} /> Logout
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 style={{ margin: 0, fontSize: '20px' }}>{title}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Moon size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color="var(--text-secondary)" />
            </div>
            <Link to="/mitra-profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <User size={16} />
              </div>
              <span style={{ fontWeight: '500' }}>{username}</span>
            </Link>
          </div>
        </header>
        <div className="content-area animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MitraLayout;
