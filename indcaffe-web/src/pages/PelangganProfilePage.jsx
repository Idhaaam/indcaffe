import React, { useState, useEffect } from 'react';
import InternalLayout from '../components/InternalLayout';
import { User, Mail, MapPin, Phone } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

export default function PelangganProfilePage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    noTelpon: '',
    alamat: ''
  });

  const username = localStorage.getItem('username') || 'Pelanggan';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/pelanggan/profil');
        const data = response.data;
        if (data) {
          setFormData({
            namaLengkap: data.namaLengkap || '',
            email: data.email || '',
            noTelpon: data.noTelpon || '',
            alamat: data.alamat || ''
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Gagal memuat data profil");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put('/pelanggan/profil', formData);
      toast.success('Profil berhasil diperbarui!');
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Gagal memperbarui profil');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <InternalLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <p>Memuat profil...</p>
        </div>
      </InternalLayout>
    );
  }

  return (
    <InternalLayout>
      <div className="header-container">
        <h2>Profil Pengguna</h2>
      </div>

      <div className="split-layout">
        <div className="split-left" style={{ flex: '0 0 300px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#eee', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
              <User size={48} />
            </div>
            <h3 style={{ margin: '0 0 5px 0' }}>{formData.namaLengkap || username}</h3>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Pelanggan Reguler</p>
          </div>
        </div>

        <div className="split-right">
          <div className="card" style={{ padding: '30px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={20} color="var(--accent-green)" />
              Informasi Pribadi
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input type="text" name="namaLengkap" value={formData.namaLengkap} onChange={handleChange} className="form-input" placeholder="Masukkan nama lengkap" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="Masukkan email aktif" style={{ paddingLeft: '35px' }} required />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Nomor Telepon / WhatsApp</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
                  <input type="text" name="noTelpon" value={formData.noTelpon} onChange={handleChange} className="form-input" placeholder="08..." style={{ paddingLeft: '35px' }} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '30px' }}>
                <label>Alamat Pengiriman Default</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
                  <textarea name="alamat" value={formData.alamat} onChange={handleChange} className="form-input" placeholder="Masukkan alamat lengkap rumah/kantor Anda..." style={{ paddingLeft: '35px', minHeight: '100px' }}></textarea>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </InternalLayout>
  );
}
