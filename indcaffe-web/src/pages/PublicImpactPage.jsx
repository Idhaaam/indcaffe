import React from 'react';
import { Coffee, TrendingUp, Droplets, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicImpactPage = () => {
  return (
    <div>
      {/* Navbar (reused basic version) */}
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--primary-color)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Coffee color="var(--accent-green)" size={28} />
          <span style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>IndCaffe</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/">Home</Link>
          <Link to="/impact" style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>Impact</Link>
          <Link to="/login" className="btn btn-secondary" style={{ color: 'white', borderColor: 'white' }}>Login</Link>
        </div>
      </nav>

      {/* Hero Impact */}
      <section style={{ 
        padding: '80px 24px', 
        background: 'linear-gradient(180deg, #1A1A1A 0%, var(--primary-color) 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 className="animate-fade-in" style={{ color: 'white', fontSize: '56px' }}>Dampak Nyata IndCaffe</h1>
        <p className="animate-fade-in" style={{ color: 'var(--secondary-color)', fontSize: '20px', opacity: 0.9, animationDelay: '0.1s' }}>
          Bersama, kita menyelamatkan makanan dan melindungi bumi.
        </p>
      </section>

      <section style={{ padding: '60px 24px', background: 'var(--bg-main)' }}>
        <div className="container grid grid-cols-4 gap-6 animate-fade-in">
          <div className="card glass-card" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)', color: 'white', border: 'none' }}>
            <Coffee size={32} style={{ marginBottom: '16px', opacity: 0.8 }} />
            <h2 style={{ color: 'white', fontSize: '36px', margin: 0 }}>2,350 kg</h2>
            <h4 style={{ margin: 0, opacity: 0.9 }}>Makanan Diselamatkan</h4>
            <p style={{ marginTop: '8px', fontSize: '13px', opacity: 0.8 }}>Setara 7,050 porsi makan</p>
          </div>
          <div className="card glass-card" style={{ background: 'linear-gradient(135deg, #42A5F5 0%, #1565C0 100%)', color: 'white', border: 'none' }}>
            <TrendingUp size={32} style={{ marginBottom: '16px', opacity: 0.8 }} />
            <h2 style={{ color: 'white', fontSize: '36px', margin: 0 }}>5,875 kg</h2>
            <h4 style={{ margin: 0, opacity: 0.9 }}>CO₂ Dicegah</h4>
            <p style={{ marginTop: '8px', fontSize: '13px', opacity: 0.8 }}>Setara menanam 294 pohon</p>
          </div>
          <div className="card glass-card" style={{ background: 'linear-gradient(135deg, #00BCD4 0%, #00838F 100%)', color: 'white', border: 'none' }}>
            <Droplets size={32} style={{ marginBottom: '16px', opacity: 0.8 }} />
            <h2 style={{ color: 'white', fontSize: '36px', margin: 0 }}>2.3M L</h2>
            <h4 style={{ margin: 0, opacity: 0.9 }}>Air Dihemat</h4>
            <p style={{ marginTop: '8px', fontSize: '13px', opacity: 0.8 }}>Setara 47,000 kali mandi</p>
          </div>
          <div className="card glass-card" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #EF6C00 100%)', color: 'white', border: 'none' }}>
            <Users size={32} style={{ marginBottom: '16px', opacity: 0.8 }} />
            <h2 style={{ color: 'white', fontSize: '36px', margin: 0 }}>48</h2>
            <h4 style={{ margin: 0, opacity: 0.9 }}>Café Berkontribusi</h4>
            <p style={{ marginTop: '8px', fontSize: '13px', opacity: 0.8 }}>Di 12 kota di Indonesia</p>
          </div>
        </div>

        <div className="container" style={{ marginTop: '80px', textAlign: 'center' }}>
          <h2>Mulai Buat Dampak Nyata</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '16px 32px' }}>Daftar Café Anda</Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '16px 32px' }}>Daftar Sebagai Mitra</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicImpactPage;
