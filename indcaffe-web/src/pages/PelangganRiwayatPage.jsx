import React, { useState, useEffect } from 'react';
import InternalLayout from '../components/InternalLayout';
import api from '../api';
import { formatRupiah } from '../utils/formatRupiah';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PelangganRiwayatPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      // Sort by date descending
      const sorted = (res.data || []).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrders(sorted);
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat riwayat pesanan');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING':
        return <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', background: '#fef3c7', color: '#d97706' }}>Menunggu</span>;
      case 'PAID':
        return <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', background: '#dbeafe', color: '#2563eb' }}>Dibayar</span>;
      case 'COMPLETED':
        return <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', background: '#d1fae5', color: '#059669' }}>Selesai</span>;
      case 'CANCELLED':
        return <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', background: '#fee2e2', color: '#dc2626' }}>Dibatalkan</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <InternalLayout>
      <div className="header-container">
        <h2>Riwayat Pesanan</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Daftar seluruh pesanan yang pernah Anda buat</p>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Memuat riwayat pesanan...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
            <Package size={48} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
            <h3>Belum Ada Pesanan</h3>
            <p>Anda belum pernah melakukan pesanan. Silakan kunjungi Store untuk berbelanja.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {orders.map(order => (
              <div key={order.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px dashed #eee' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={16} color="#666" />
                    <span style={{ fontSize: '14px', color: '#666' }}>{new Date(order.orderDate).toLocaleString('id-ID')}</span>
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {order.items && order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0' }}>{item.productName}</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{item.quantity} x {formatRupiah(item.price)}</p>
                    </div>
                    <div style={{ fontWeight: 'bold' }}>
                      {formatRupiah(item.quantity * item.price)}
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    Metode: <strong>{order.paymentMethod}</strong> ({order.deliveryMethod})
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--accent-green)' }}>
                    Total: {formatRupiah(order.totalAmount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </InternalLayout>
  );
}
