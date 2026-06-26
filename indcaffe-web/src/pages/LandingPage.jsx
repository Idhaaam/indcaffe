import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ChevronDown, CheckCircle, Heart, Globe, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <Link to="/impact">Impact</Link>
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
          <h1 style={{ color: 'white', fontSize: '56px', marginBottom: '20px' }}>Selamatkan Makanan, Selamatkan Bumi</h1>
          <p style={{ fontSize: '20px', color: 'var(--secondary-color)', marginBottom: '40px', opacity: 0.9 }}>
            Platform yang menghubungkan café dengan komunitas untuk mengurangi food waste dan memberi dampak nyata.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '60px' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '18px' }}>Daftar Café Anda</Link>
            <Link to="/login" className="btn btn-secondary" style={{ color: 'white', borderColor: 'white', padding: '16px 32px', fontSize: '18px' }}>Daftar Sebagai Mitra</Link>
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
            <p style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>Porsi Tersalurkan</p>
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
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>Café mengunggah makanan surplus yang masih layak konsumsi sebelum terbuang.</p>
          </div>
          <div className="card">
            <Heart size={48} color="var(--accent-red)" style={{ margin: '0 auto 20px' }} />
            <h3>2. Mitra Klaim Donasi</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>Panti asuhan, masjid, dan komunitas memilih donasi yang mereka butuhkan.</p>
          </div>
          <div className="card">
            <Globe size={48} color="var(--accent-green)" style={{ margin: '0 auto 20px' }} />
            <h3>3. Dampak Nyata Tercipta</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>Makanan terselamatkan, emisi berkurang, dan komunitas terbantu.</p>
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
            <ul style={{ opacity: 0.7, lineHeight: '2' }}>
              <li>Tentang Kami</li>
              <li>Cara Kerja</li>
              <li>Fitur</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white' }}>Bergabung</h4>
            <ul style={{ opacity: 0.7, lineHeight: '2' }}>
              <li><Link to="/login">Daftar Café</Link></li>
              <li><Link to="/login">Daftar Mitra</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white' }}>Lainnya</h4>
            <ul style={{ opacity: 0.7, lineHeight: '2' }}>
              <li>Kontak</li>
              <li>FAQ</li>
              <li>Kebijakan Privasi</li>
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
