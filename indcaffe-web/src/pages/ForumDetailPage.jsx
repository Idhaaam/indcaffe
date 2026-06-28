import React, { useState, useEffect } from 'react';
import InternalLayout from '../components/InternalLayout';
import { ArrowLeft, User } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function ForumDetailPage() {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThread();
  }, [id]);

  const fetchThread = async () => {
    try {
      const res = await api.get(`/forum/${id}`);
      setThread(res.data);
    } catch (error) {
      console.error('Failed to fetch thread', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await api.post(`/forum/${id}/replies`, { content: replyText });
      setReplyText('');
      fetchThread(); // Refresh to get the new reply
    } catch (error) {
      console.error('Failed to submit reply', error);
    }
  };

  if (loading) {
    return (
      <InternalLayout title="Detail Diskusi">
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Memuat diskusi...</div>
      </InternalLayout>
    );
  }

  if (!thread) {
    return (
      <InternalLayout title="Detail Diskusi">
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Diskusi tidak ditemukan.</div>
      </InternalLayout>
    );
  }

  const replies = thread.replies || [];

  return (
    <InternalLayout title="Detail Diskusi">
      <div className="forum-detail-page">
        <a href="/forum" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Kembali ke Forum
        </a>

        {/* Original Post */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
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
            <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{thread.date || (thread.createdAt ? new Date(thread.createdAt).toLocaleDateString() : '')}</span>
          </div>
          <h1 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.5rem' }}>{thread.title}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b' }}>
              <User size={20} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{thread.author || 'User'}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Penulis Thread</p>
            </div>
          </div>
          
          <div style={{ lineHeight: '1.6', color: '#334155' }}>
            {thread.content}
          </div>
        </div>

        {/* Replies Section */}
        <h3 style={{ marginBottom: '1.5rem' }}>Balasan ({replies.length})</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {replies.map(reply => (
            <div key={reply.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b', fontWeight: 'bold' }}>
                  {reply.author ? reply.author.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.875rem' }}>{reply.author || 'User'}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{reply.time || (reply.createdAt ? new Date(reply.createdAt).toLocaleDateString() : '')}</p>
                </div>
              </div>
              <p style={{ margin: 0, lineHeight: '1.5', color: '#334155' }}>
                {reply.content}
              </p>
            </div>
          ))}
          {replies.length === 0 && (
            <p style={{ color: '#64748b' }}>Belum ada balasan.</p>
          )}
        </div>

        {/* Reply Form */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Tulis Balasan</h4>
          <form onSubmit={handleReplySubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <textarea 
                className="form-input" 
                rows={4} 
                placeholder="Tuliskan balasan Anda di sini..." 
                value={replyText} 
                onChange={e => setReplyText(e.target.value)} 
                required
              ></textarea>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={!replyText.trim()}>
                Kirim Balasan
              </button>
            </div>
          </form>
        </div>

      </div>
    </InternalLayout>
  );
}
