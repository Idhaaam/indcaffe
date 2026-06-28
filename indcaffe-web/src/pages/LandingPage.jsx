import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Heart, Globe } from 'lucide-react';

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      {/* Navbar */}
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-color)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Coffee color="var(--accent-green)" size={28} />
          <span style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>IndCaffe</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/">Home</Link>
          <a href="#" onClick={handleLinkClick} style={{ color: 'white', textDecoration: 'none' }}>Impact</a>
          <Link to="/login" className="btn btn-secondary" style={{ color: 'white', borderColor: 'white' }}>Login</Link>
          <Link to="/login" className="btn btn-primary">Daftar</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        minHeight: '80vh', 
        background: 'linear-gradient(135deg, var(--primary-color) 0%, #1a1a1a 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 20px',
        position: 'relative'
      }}>
        <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
          <Coffee color="var(--accent-green)" size={64} style={{ marginBottom: '24px' }} />
          <h1 style={{ color: 'white', fontSize: '56px', marginBottom: '20px' }}>Marketplace Surplus Makanan Café</h1>
          <p style={{ fontSize: '20px', color: 'var(--secondary-color)', marginBottom: '40px', opacity: 0.9 }}>
            Platform jual beli yang menghubungkan café dengan komunitas untuk menjual produk surplus dengan harga terjangkau.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '60px' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '18px' }}>Daftar Sebagai Café</Link>
            <Link to="/login" className="btn btn-secondary" style={{ color: 'white', borderColor: 'white', padding: '16px 32px', fontSize: '18px' }}>Mulai Belanja (Mitra)</Link>
          </div>
        </div>

        {/* Counters */}
        <div style={{ display: 'flex', gap: '60px', marginTop: '40px' }} className="animate-fade-in">
          <div>
            <h2 style={{ color: 'white', fontSize: '48px', margin: 0 }}>2,350 kg</h2>
            <p style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>Makanan Diselamatkan</p>
          </div>
          <div>
            <h2 style={{ color: 'white', fontSize: '48px', margin: 0 }}>5,875 kg</h2>
            <p style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>CO₂ Dicegah</p>
          </div>
          <div>
            <h2 style={{ color: 'white', fontSize: '48px', margin: 0 }}>7,050</h2>
            <p style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>Porsi Terjual</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '100px 24px', background: 'var(--bg-main)', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '60px' }}>Bagaimana IndCaffe Bekerja?</h2>
        <div className="grid grid-cols-3 container gap-6">
          <div className="card">
            <Coffee size={48} color="var(--primary-color)" style={{ margin: '0 auto 20px' }} />
            <h3>1. Café Posting Surplus</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>Café mengunggah makanan surplus yang masih layak konsumsi dengan harga diskon.</p>
          </div>
          <div className="card">
            <Heart size={48} color="var(--accent-red)" style={{ margin: '0 auto 20px' }} />
            <h3>2. Mitra Pesan Produk</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>Komunitas atau pembeli individu memilih dan membeli produk yang mereka butuhkan.</p>
          </div>
          <div className="card">
            <Globe size={48} color="var(--accent-green)" style={{ margin: '0 auto 20px' }} />
            <h3>3. Dampak Nyata Tercipta</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>Makanan terselamatkan, café mendapat pemasukan tambahan, dan pembeli hemat.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--primary-color)', color: 'white', padding: '60px 24px 24px' }}>
        <div className="container grid grid-cols-4 gap-6" style={{ marginBottom: '40px' }}>
          <div>
            <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Coffee color="var(--accent-green)" /> IndCaffe
            </h3>
            <p style={{ opacity: 0.7, marginTop: '12px' }}>Save Food, Save Earth.</p>
          </div>
          <div>
            <h4 style={{ color: 'white' }}>Platform</h4>
            <ul style={{ opacity: 0.7, lineHeight: '2', listStyle: 'none', padding: 0 }}>
              <li><a href="#" onClick={handleLinkClick} style={{ color: 'inherit', textDecoration: 'none' }}>Tentang Kami</a></li>
              <li><a href="#" onClick={handleLinkClick} style={{ color: 'inherit', textDecoration: 'none' }}>Cara Kerja</a></li>
              <li><a href="#" onClick={handleLinkClick} style={{ color: 'inherit', textDecoration: 'none' }}>Fitur</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white' }}>Bergabung</h4>
            <ul style={{ opacity: 0.7, lineHeight: '2', listStyle: 'none', padding: 0 }}>
              <li><Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Daftar Café</Link></li>
              <li><Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Daftar Mitra</Link></li>
              <li><Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white' }}>Lainnya</h4>
            <ul style={{ opacity: 0.7, lineHeight: '2', listStyle: 'none', padding: 0 }}>
              <li><a href="#" onClick={handleLinkClick} style={{ color: 'inherit', textDecoration: 'none' }}>Kontak</a></li>
              <li><a href="#" onClick={handleLinkClick} style={{ color: 'inherit', textDecoration: 'none' }}>FAQ</a></li>
              <li><a href="#" onClick={handleLinkClick} style={{ color: 'inherit', textDecoration: 'none' }}>Kebijakan Privasi</a></li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', opacity: 0.5, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
          &copy; 2026 IndCaffe. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
