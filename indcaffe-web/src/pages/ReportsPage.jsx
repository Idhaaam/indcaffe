import React, { useState } from 'react';
import InternalLayout from '../components/InternalLayout';
import { Download, FileText } from 'lucide-react';

const mockReportData = [
  { id: 'TRX-001', tanggal: '2026-06-25', kafe: 'Kopi Senja', jenis: 'Keuangan', nominal: 'Rp 45.000', status: 'Selesai' },
  { id: 'TRX-002', tanggal: '2026-06-25', kafe: 'Bake & Brew', jenis: 'Keuangan', nominal: 'Rp 120.000', status: 'Selesai' },
  { id: 'TRX-003', tanggal: '2026-06-26', kafe: 'Kopi Senja', jenis: 'Keuangan', nominal: 'Rp 30.000', status: 'Selesai' },
  { id: 'TRX-004', tanggal: '2026-06-27', kafe: 'Morning Call', jenis: 'Keuangan', nominal: 'Rp 75.000', status: 'Selesai' },
  { id: 'TRX-005', tanggal: '2026-06-27', kafe: 'Bake & Brew', jenis: 'Keuangan', nominal: 'Rp 50.000', status: 'Dibatalkan' },
  { id: 'TRX-006', tanggal: '2026-06-28', kafe: 'Morning Call', jenis: 'Keuangan', nominal: 'Rp 90.000', status: 'Selesai' },
];

export default function ReportsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('keuangan');
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerated(true);
  };

  return (
    <InternalLayout title="Buat Laporan">
      <div className="reports-page">
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
              <label className="form-label">Tanggal Mulai</label>
              <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
            <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
              <label className="form-label">Tanggal Selesai</label>
              <input type="date" className="form-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </div>
            <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
              <label className="form-label">Jenis Laporan</label>
              <select className="form-input" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <option value="keuangan">Keuangan</option>
                <option value="performa">Performa Kafe</option>
              </select>
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>Generate</button>
            </div>
          </form>
        </div>

        {isGenerated && (
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Preview Laporan</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', background: 'white' }}>
                  <FileText size={16} /> Unduh PDF
                </button>
                <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', background: 'white' }}>
                  <Download size={16} /> Unduh Excel
                </button>
              </div>
            </div>

            <div className="table-container" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '1rem', color: '#64748b' }}>ID Transaksi</th>
                    <th style={{ padding: '1rem', color: '#64748b' }}>Tanggal</th>
                    <th style={{ padding: '1rem', color: '#64748b' }}>Kafe</th>
                    <th style={{ padding: '1rem', color: '#64748b' }}>Jenis</th>
                    <th style={{ padding: '1rem', color: '#64748b' }}>Nominal</th>
                    <th style={{ padding: '1rem', color: '#64748b' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockReportData.map((row, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem' }}>{row.id}</td>
                      <td style={{ padding: '1rem' }}>{row.tanggal}</td>
                      <td style={{ padding: '1rem' }}>{row.kafe}</td>
                      <td style={{ padding: '1rem' }}>{row.jenis}</td>
                      <td style={{ padding: '1rem', fontWeight: 'bold' }}>{row.nominal}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '9999px', 
                          fontSize: '0.875rem',
                          backgroundColor: row.status === 'Selesai' ? '#dcfce7' : '#fee2e2',
                          color: row.status === 'Selesai' ? '#16a34a' : '#ef4444'
                        }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </InternalLayout>
  );
}
