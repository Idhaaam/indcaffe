import React, { useState, useEffect } from 'react';
import InternalLayout from '../components/InternalLayout';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Users, Coffee } from 'lucide-react';
import api from '../api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8B5CF6', '#EC4899'];

const mockLineData = [
  { name: 'Jan', pengguna: 400 },
  { name: 'Feb', pengguna: 600 },
  { name: 'Mar', pengguna: 800 },
  { name: 'Apr', pengguna: 1200 },
  { name: 'Mei', pengguna: 1500 },
  { name: 'Jun', pengguna: 2100 },
];

export default function AnalyticsPage() {
  const [data, setData] = useState({
    totalSurplusSaved: 0,
    totalValue: 0,
    activeCafesCount: 0,
    newUsersCount: 0,
    pieChartData: [],
    barChartData: [],
    lineChartData: mockLineData
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/manager/analytics');
      const apiData = res.data;
      
      // Map properties to ensure they match recharts expectation if possible
      const mappedBarData = apiData.barChartData?.map(item => ({
        name: item.name || item.label || '',
        transaksi: item.transaksi !== undefined ? item.transaksi : (item.value || item.count || 0)
      })) || [];

      const mappedPieData = apiData.pieChartData?.map(item => ({
        name: item.name || item.label || '',
        value: item.value !== undefined ? item.value : (item.count || 0)
      })) || [];

      setData(prev => ({
        ...prev,
        totalSurplusSaved: apiData.totalSurplusSaved || 0,
        totalValue: apiData.totalValue || 0,
        activeCafesCount: apiData.activeCafesCount || 0,
        newUsersCount: apiData.newUsersCount || 0,
        pieChartData: mappedPieData.length ? mappedPieData : prev.pieChartData,
        barChartData: mappedBarData.length ? mappedBarData : prev.barChartData,
      }));
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <InternalLayout title="Analitik & Laporan">
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Memuat data analitik...</div>
      </InternalLayout>
    );
  }

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <InternalLayout title="Analitik & Laporan">
      <div className="analytics-page">
        <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="icon-wrapper" style={{ padding: '1rem', backgroundColor: '#e0f2fe', borderRadius: '50%', color: '#0284c7' }}>
              <ShoppingBag size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Total Surplus Terjual</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>{data.totalSurplusSaved.toLocaleString('id-ID')} porsi</p>
            </div>
          </div>
          <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="icon-wrapper" style={{ padding: '1rem', backgroundColor: '#dcfce7', borderRadius: '50%', color: '#16a34a' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Total Nilai (Rp)</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>{formatRupiah(data.totalValue)}</p>
            </div>
          </div>
          <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="icon-wrapper" style={{ padding: '1rem', backgroundColor: '#fef08a', borderRadius: '50%', color: '#ca8a04' }}>
              <Users size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Pengguna Baru</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>+{data.newUsersCount.toLocaleString('id-ID')}</p>
            </div>
          </div>
          <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="icon-wrapper" style={{ padding: '1rem', backgroundColor: '#ffedd5', borderRadius: '50%', color: '#ea580c' }}>
              <Coffee size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Kafe Aktif</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>{data.activeCafesCount.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>

        <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Kategori Surplus</h3>
            <div style={{ height: '300px' }}>
              {data.pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.pieChartData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                      {data.pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#64748b' }}>Data tidak tersedia</div>
              )}
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Tren Transaksi Mingguan</h3>
            <div style={{ height: '300px' }}>
              {data.barChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="transaksi" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#64748b' }}>Data tidak tersedia</div>
              )}
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', gridColumn: '1 / -1' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Pertumbuhan Pengguna (6 Bulan)</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="pengguna" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </InternalLayout>
  );
}
