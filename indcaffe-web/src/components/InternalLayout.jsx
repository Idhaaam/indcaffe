import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Coffee, LayoutDashboard, Package, Inbox, AlertTriangle, LogOut, Moon, Sun, Bell, User, HeartHandshake, MessageCircle, Menu } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const InternalLayout = ({ children, title }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { expiryAlerts, claims, isDarkMode, toggleDarkMode } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    navigate('/login');
  };

  const username = localStorage.getItem('username') || 'Admin';
  const cafeName = localStorage.getItem('name') || username;

  return (
    <div className="app-layout">
      {/* Mobile Overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '0 24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Coffee color="var(--accent-green)" size={32} />
          <h2 style={{ color: 'white', margin: 0, fontSize: '24px' }}>IndCaffe</h2>
        </div>
        
        <div style={{ padding: '0 24px', marginBottom: '24px' }}>
          <p style={{ color: 'white', fontSize: '14px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>☕ {cafeName}</p>
          <span style={{ fontSize: '12px', color: 'var(--accent-green)' }}>Admin</span>
        </div>

        <nav>
          <ul style={{ padding: '0 12px' }}>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/dashboard" style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                background: currentPath === '/dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderLeft: currentPath === '/dashboard' ? '3px solid var(--accent-green)' : '3px solid transparent',
                color: 'white', borderRadius: '4px', opacity: currentPath === '/dashboard' ? 1 : 0.7
              }}>
                <LayoutDashboard size={20} /> Dashboard
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/produk" style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                background: currentPath === '/produk' ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderLeft: currentPath === '/produk' ? '3px solid var(--accent-green)' : '3px solid transparent',
                color: 'white', borderRadius: '4px', opacity: currentPath === '/produk' ? 1 : 0.7
              }}>
                <Package size={20} /> Produk
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/stok-masuk" style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                background: currentPath === '/stok-masuk' ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderLeft: currentPath === '/stok-masuk' ? '3px solid var(--accent-green)' : '3px solid transparent',
                color: 'white', borderRadius: '4px', opacity: currentPath === '/stok-masuk' ? 1 : 0.7
              }}>
                <Inbox size={20} /> Stok Masuk
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/expiry-alert" style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                background: currentPath === '/expiry-alert' ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderLeft: currentPath === '/expiry-alert' ? '3px solid var(--accent-green)' : '3px solid transparent',
                color: 'white', borderRadius: '4px', opacity: currentPath === '/expiry-alert' ? 1 : 0.7
              }}>
                <AlertTriangle size={20} /> Expiry Alert 
                {expiryAlerts && expiryAlerts.length > 0 && <span className="badge badge-red" style={{ marginLeft: 'auto' }}>{expiryAlerts.length}</span>}
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/cafe-klaim" style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                background: currentPath === '/cafe-klaim' ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderLeft: currentPath === '/cafe-klaim' ? '3px solid var(--accent-green)' : '3px solid transparent',
                color: 'white', borderRadius: '4px', opacity: currentPath === '/cafe-klaim' ? 1 : 0.7
              }}>
                <HeartHandshake size={20} /> Pesanan Masuk 
                {claims && claims.length > 0 && <span className="badge" style={{ background: 'var(--accent-blue)', color: 'white', marginLeft: 'auto' }}>{claims.length}</span>}
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/chat" style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                background: currentPath === '/chat' ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderLeft: currentPath === '/chat' ? '3px solid var(--accent-green)' : '3px solid transparent',
                color: 'white', borderRadius: '4px', opacity: currentPath === '/chat' ? 1 : 0.7
              }}>
                <MessageCircle size={20} /> Pesan
              </Link>
            </li>
            <li style={{ marginTop: 'auto', paddingTop: '24px' }}>
              <a href="#" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#EF5350' }}>
                <LogOut size={20} /> Logout
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
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
              {expiryAlerts && expiryAlerts.length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--accent-red)', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{expiryAlerts.length}</span>}
              {showNotifications && (
                <div className="card dropdown-menu" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '12px', width: '300px', padding: '16px', zIndex: 100, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
                  <h4 style={{ margin: '0 0 12px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Notifikasi</h4>
                  {expiryAlerts && expiryAlerts.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {expiryAlerts.map(alert => (
                         <Link to="/expiry-alert" key={alert.id} style={{ display: 'flex', gap: '12px', textDecoration: 'none', color: 'inherit', alignItems: 'center' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)' }}></div>
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: 0, fontSize: '13px', fontWeight: '500' }}>Produk Hampir Kedaluwarsa</p>
                              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>{alert.name} (Sisa: {alert.currentStock})</p>
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
            <Link to="/cafe-profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
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

export default InternalLayout;
