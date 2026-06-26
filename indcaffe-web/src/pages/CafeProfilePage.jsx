import React, { useState } from 'react';
import InternalLayout from '../components/InternalLayout';
import { User, Building, MapPin, Clock, Camera, Save, Shield } from 'lucide-react';

const CafeProfilePage = () => {
  const username = localStorage.getItem('username') || 'Admin';
  const cafeName = localStorage.getItem('name') || username;
  const address = localStorage.getItem('address') || '';
  const city = localStorage.getItem('city') || '';

  const [formData, setFormData] = useState({
    name: cafeName,
    email: `${username}@indcaffe.com`, // dummy email based on username
    address: address,
    city: city
  });

  return (
    <InternalLayout title="Dashboard / Profil Bisnis">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Building size={28} color="var(--primary-color)" /> Pengaturan & Profil Café
        </h2>
        <button className="btn btn-primary"><Save size={18} /> Simpan Perubahan</button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Kolom Kiri: Foto & Basic Info */}
        <div className="card" style={{ gridColumn: 'span 1', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 16px', borderRadius: '50%', background: '#F5F5F5', border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={32} color="var(--text-secondary)" />
            <button className="btn btn-secondary" style={{ position: 'absolute', bottom: 0, right: 0, padding: '8px', borderRadius: '50%', background: 'white' }}>
              <User size={16} />
            </button>
          </div>
          <h3 style={{ margin: '0 0 4px 0' }}>{cafeName}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px' }}>Akun Partner - {city}</p>
          
          <div style={{ marginTop: '24px', textAlign: 'left', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>PENGATURAN KEAMANAN</h4>
            <button className="btn btn-secondary" style={{ width: '100%', marginBottom: '8px', justifyContent: 'center' }}><Shield size={16}/> Ubah Password</button>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}>Nonaktifkan Akun</button>
          </div>
        </div>

        {/* Kolom Kanan: Form Detail */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>Informasi Bisnis</h3>
          
          <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '24px' }}>
            <div className="form-group">
              <label className="form-label">Nama Bisnis</label>
              <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Email / Kontak</label>
              <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Alamat Lengkap</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '12px', color: 'var(--text-secondary)' }} />
                <textarea className="form-input" style={{ paddingLeft: '44px', height: '80px' }} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
          </div>

          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>Jam Operasional & Donasi</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Buka / Tutup Toko</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="var(--text-secondary)" />
                <input type="time" className="form-input" defaultValue="08:00" />
                <span>-</span>
                <input type="time" className="form-input" defaultValue="22:00" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Batas Waktu Pengambilan Donasi</label>
              <select className="form-input">
                <option>Sama dengan jam tutup (22:00)</option>
                <option>1 jam sebelum tutup (21:00)</option>
                <option>Fleksibel (Pilih manual tiap donasi)</option>
              </select>
            </div>
          </div>

        </div>
      </div>
    </InternalLayout>
  );
};

export default CafeProfilePage;
