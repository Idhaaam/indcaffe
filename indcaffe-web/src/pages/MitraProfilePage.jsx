import React, { useState } from 'react';
import MitraLayout from '../components/MitraLayout';
import { User, FileText, MapPin, Phone, Save, ShieldCheck } from 'lucide-react';

const MitraProfilePage = () => {
  const username = localStorage.getItem('username') || 'Mitra';
  const mitraName = localStorage.getItem('name') || username;
  const address = localStorage.getItem('address') || '';
  const city = localStorage.getItem('city') || '';

  const [formData, setFormData] = useState({
    name: mitraName,
    pic: username,
    phone: '',
    address: address
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('name', formData.name);
    localStorage.setItem('address', formData.address);
    alert('Profil berhasil disimpan!');
  };

  return (
    <MitraLayout title="Mitra / Profil Organisasi">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary-color)' }}>
          <User size={28} /> Pengaturan Profil Mitra
        </h2>
        <button className="btn btn-primary" onClick={handleSaveProfile}><Save size={18} /> Simpan Profil</button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="card" style={{ gridColumn: 'span 1', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 16px', borderRadius: '50%', background: '#E3F2FD', border: '2px dashed #90CAF9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={48} color="#1565C0" />
          </div>
          <h3 style={{ margin: '0 0 4px 0' }}>{formData.name}</h3>
          <p style={{ margin: 0, color: '#2E7D32', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontWeight: '500' }}>
            <ShieldCheck size={16} /> Terverifikasi - {city}
          </p>
          
          <div style={{ marginTop: '24px', background: '#F5F5F5', padding: '16px', borderRadius: '8px', textAlign: 'left' }}>
            <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>DOKUMEN LEGALITAS</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)' }}>
              <FileText size={16} />
              <span style={{ fontSize: '13px', fontWeight: '500' }}>SK_Kemensos_2024.pdf</span>
            </div>
            <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--accent-green)', fontWeight: 'bold' }}>Dokumen terverifikasi ✅</p>
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>Detail Organisasi</h3>
          
          <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '24px' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Nama Organisasi / Yayasan</label>
              <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Nama PIC (Penanggung Jawab)</label>
              <input type="text" className="form-input" value={formData.pic} onChange={e => setFormData({...formData, pic: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">No. Telepon / WhatsApp PIC</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input type="tel" className="form-input" style={{ paddingLeft: '44px' }} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Contoh: 0812..." />
              </div>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Alamat Lengkap Organisasi</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '12px', color: 'var(--text-secondary)' }} />
                <textarea className="form-input" style={{ paddingLeft: '44px', height: '80px' }} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
          </div>

          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>Preferensi Penerimaan</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Kapasitas Porsi Sekali Ambil</label>
              <select className="form-input">
                <option>Skala Kecil (1-10 porsi)</option>
                <option selected>Skala Menengah (10-50 porsi)</option>
                <option>Skala Besar (&gt;50 porsi)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Ketersediaan Transportasi</label>
              <select className="form-input">
                <option>Ada Kendaraan (Bisa jemput langsung)</option>
                <option>Tidak Ada (Butuh diantar)</option>
              </select>
            </div>
          </div>

        </div>
      </div>
    </MitraLayout>
  );
};

export default MitraProfilePage;
