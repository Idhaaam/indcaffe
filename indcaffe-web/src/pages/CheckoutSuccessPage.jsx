import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import InternalLayout from '../components/InternalLayout';

export default function CheckoutSuccessPage() {
  const role = localStorage.getItem('role') || 'PELANGGAN';
  const targetLink = role === 'MITRA' ? '/mitra-klaim' : '/store';

  return (
    <InternalLayout title="Checkout Berhasil">
      <div className="card" style={{ padding: '40px 20px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 20px' }} />
        <h2 style={{ marginBottom: '10px' }}>Pembayaran Berhasil!</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>Pesanan Anda sedang diproses oleh Kafe.</p>
        <Link to={targetLink} className="btn btn-primary" style={{ display: 'inline-block', padding: '12px 24px', textDecoration: 'none', background: '#10b981', color: 'white', borderRadius: '4px' }}>
          Lihat Pesanan Saya
        </Link>
      </div>
    </InternalLayout>
  );
}
