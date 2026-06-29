import React, { useState, useEffect } from 'react';
import InternalLayout from '../components/InternalLayout';
import { MessageSquare, Plus, X } from 'lucide-react';
import api from '../api';

export default function ForumPage() {
  const [filter, setFilter] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', category: 'QnA', content: '' });
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const res = await api.get('/forum');
      setThreads(res.data);
    } catch (error) {
      console.error('Failed to fetch threads', error);
    }
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();
    try {
      const authorId = localStorage.getItem('userId');
      await api.post('/forum', { ...newThread, authorId });
      setShowModal(false);
      setNewThread({ title: '', category: 'QnA', content: '' });
      fetchThreads();
    } catch (error) {
      console.error('Failed to create thread', error);
      alert('Gagal membuat thread: ' + (error.response?.data?.message || error.message));
    }
  };

  const filteredThreads = filter === 'Semua' ? threads : threads.filter(t => t.category === filter);

  return (
    <InternalLayout title="Forum Komunitas">
      <div className="forum-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['Semua', 'Tips', 'QnA'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`btn ${filter === f ? 'btn-primary' : ''}`}
                style={{ 
                  backgroundColor: filter === f ? '#0f172a' : 'white', 
                  color: filter === f ? 'white' : '#64748b',
                  border: filter === f ? 'none' : '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '0.5rem 1.25rem'
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Buat Thread
          </button>
        </div>

        <div className="threads-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredThreads.map(thread => (
            <a href={`/community/forum/${thread.id}`} key={thread.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'box-shadow 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)'} onMouseOut={e => e.currentTarget.style.boxShadow = ''}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold',
                      backgroundColor: thread.category === 'Tips' ? '#dcfce7' : '#e0f2fe',
                      color: thread.category === 'Tips' ? '#16a34a' : '#0284c7'
                    }}>
                      {thread.category}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{thread.title}</h3>
                  </div>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                      Oleh <strong>{thread.authorName || 'User'}</strong> • {thread.date || (thread.createdAt ? new Date(thread.createdAt).toLocaleDateString() : '')}
                    </p>
                </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                    <MessageSquare size={20} />
                    <span>{thread.replyCount ?? (Array.isArray(thread.replies) ? thread.replies.length : (thread.replies || 0))} balasan</span>
                  </div>
              </div>
            </a>
          ))}
          {filteredThreads.length === 0 && (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>Belum ada thread diskusi.</p>
          )}
        </div>

        {/* Modal Buat Thread */}
        {showModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
              <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={24} />
              </button>
              <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Buat Thread Baru</h2>
              <form onSubmit={handleCreateThread}>
                <div className="form-group">
                  <label className="form-label">Judul</label>
                  <input type="text" className="form-input" value={newThread.title} onChange={e => setNewThread({...newThread, title: e.target.value})} required placeholder="Masukkan judul diskusi..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Kategori</label>
                  <select className="form-input" value={newThread.category} onChange={e => setNewThread({...newThread, category: e.target.value})}>
                    <option value="QnA">Tanya Jawab (QnA)</option>
                    <option value="Tips">Tips & Trik</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Isi Diskusi</label>
                  <textarea className="form-input" rows={5} value={newThread.content} onChange={e => setNewThread({...newThread, content: e.target.value})} required placeholder="Tuliskan isi pikiranmu di sini..."></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                  <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none' }}>Batal</button>
                  <button type="submit" className="btn btn-primary">Posting Thread</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </InternalLayout>
  );
}
