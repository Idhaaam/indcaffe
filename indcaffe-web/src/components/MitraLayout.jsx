import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Coffee, ShoppingCart, ClipboardList, ScrollText, User, LogOut, Bell, Moon, Sun, MessageCircle, Menu } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const MitraLayout = ({ children, title }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { isDarkMode, toggleDarkMode, claims } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    navigate('/login');
  };

  const username = localStorage.getItem('username') || 'Mitra';
  const mitraName = localStorage.getItem('name') || username;

  // Find newly available donasi or something, but for Mitra we can just show empty for now or use `claims`
  const pendingClaims = claims ? claims.filter(c => c.status === 'Menunggu') : [];

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
                <ShoppingCart size={20} /> Etalase Surplus
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/mitra-klaim" style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                background: currentPath === '/mitra-klaim' ? 'rgba(255,255,255,0.2)' : 'transparent',
                borderLeft: currentPath === '/mitra-klaim' ? '3px solid white' : '3px solid transparent',
                color: 'white', borderRadius: '4px', opacity: currentPath === '/mitra-klaim' ? 1 : 0.8
              }}>
                <ClipboardList size={20} /> Pesanan Saya
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/mitra-riwayat" style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                background: currentPath === '/mitra-riwayat' ? 'rgba(255,255,255,0.2)' : 'transparent',
                borderLeft: currentPath === '/mitra-riwayat' ? '3px solid white' : '3px solid transparent',
                color: 'white', borderRadius: '4px', opacity: currentPath === '/mitra-riwayat' ? 1 : 0.8
              }}>
                <ScrollText size={20} /> Riwayat Pesanan
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
            <div onClick={toggleDarkMode} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              {isDarkMode ? <Sun size={20} color="#FDB813" /> : <Moon size={20} color="var(--text-secondary)" />}
            </div>
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={20} color="var(--text-secondary)" />
              {pendingClaims && pendingClaims.length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--accent-red)', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{pendingClaims.length}</span>}
              {showNotifications && (
                <div className="card dropdown-menu" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '12px', width: '300px', padding: '16px', zIndex: 100, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
                  <h4 style={{ margin: '0 0 12px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Notifikasi</h4>
                  {pendingClaims && pendingClaims.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {pendingClaims.map(claim => (
                         <Link to="/mitra-klaim" key={claim.id} style={{ display: 'flex', gap: '12px', textDecoration: 'none', color: 'inherit', alignItems: 'center' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)' }}></div>
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: 0, fontSize: '13px', fontWeight: '500' }}>Menunggu Konfirmasi</p>
                              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Pesanan {claim.productName}</p>
                            </div>
                         </Link>
                      ))}
                    </div>
                  ) : (
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>Tidak ada notifikasi baru.</p>
                  )}
                </div>
              )}
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
