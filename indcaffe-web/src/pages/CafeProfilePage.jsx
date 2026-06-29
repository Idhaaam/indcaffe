import React, { useState } from 'react';
import InternalLayout from '../components/InternalLayout';
import { Building, MapPin, Clock, Save } from 'lucide-react';
import api from '../api';

const CafeProfilePage = () => {
  const username = localStorage.getItem('username') || 'Admin';
  const cafeName = localStorage.getItem('name') || username;
  const address = localStorage.getItem('address') || '';
  const city = localStorage.getItem('city') || '';
  const cafeId = localStorage.getItem('cafeId');

  const [formData, setFormData] = useState({
    name: cafeName,
    email: `${username}@indcaffe.com`, // dummy email based on username
    address: address,
    city: city
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      if (cafeId && cafeId !== 'null') {
        await api.put(`/master/cafes/${cafeId}`, {
          name: formData.name,
          address: formData.address,
          city: formData.city
        });
        localStorage.setItem('name', formData.name);
        localStorage.setItem('address', formData.address);
        localStorage.setItem('city', formData.city);
        alert('Profil berhasil disimpan!');
      } else {
        alert('Data Cafe ID tidak ditemukan.');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan profil');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Password baru dan konfirmasi password tidak cocok!");
      return;
    }
    
    try {
      await api.put('/users/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      alert("Password berhasil diubah!");
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal mengubah password");
    }
  };

  return (
    <InternalLayout title="Dashboard / Profil Bisnis">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Building size={28} color="var(--primary-color)" /> Pengaturan & Profil Café
        </h2>
        <button className="btn btn-primary" onClick={handleSaveProfile}><Save size={18} /> Simpan Perubahan</button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Kolom Kiri: Basic Info */}
        <div className="card" style={{ gridColumn: 'span 1', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 16px', borderRadius: '50%', background: '#F5F5F5', border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building size={48} color="var(--text-secondary)" />
          </div>
          <h3 style={{ margin: '0 0 4px 0' }}>{formData.name}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px' }}>Akun Partner - {formData.city}</p>
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
            <div className="form-group">
              <label className="form-label">Kota</label>
              <input type="text" className="form-input" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Alamat Lengkap</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '12px', color: 'var(--text-secondary)' }} />
                <textarea className="form-input" style={{ paddingLeft: '44px', height: '80px' }} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
          </div>

          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>Jam Operasional</h3>
          
          <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '30px' }}>
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
              <label className="form-label">Batas Waktu Pengambilan Pesanan</label>
              <select className="form-input">
                <option>Sama dengan jam tutup (22:00)</option>
                <option>1 jam sebelum tutup (21:00)</option>
                <option>Fleksibel (Pilih manual tiap pesanan)</option>
              </select>
            </div>
          </div>

          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>Keamanan Akun</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Password Lama</label>
              <input type="password" className="form-input" value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} placeholder="Masukkan password lama" />
            </div>
            <div className="form-group">
              <label className="form-label">Password Baru</label>
              <input type="password" className="form-input" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} placeholder="Masukkan password baru" />
            </div>
            <div className="form-group">
              <label className="form-label">Konfirmasi Password</label>
              <input type="password" className="form-input" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} placeholder="Ulangi password baru" />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2', textAlign: 'right' }}>
              <button 
                className="btn btn-outline" 
                onClick={handlePasswordChange}
                disabled={!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #10b981', color: '#10b981', background: 'transparent', cursor: (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) ? 'not-allowed' : 'pointer', opacity: (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) ? 0.5 : 1 }}
              >
                Ganti Password
              </button>
            </div>
          </div>

        </div>
      </div>
    </InternalLayout>
  );
};

export default CafeProfilePage;
