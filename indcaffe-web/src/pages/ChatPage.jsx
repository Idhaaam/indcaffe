import React, { useState, useEffect, useRef } from 'react';
import InternalLayout from '../components/InternalLayout';
import { Send, Search, User, MessageCircle } from 'lucide-react';
import api from '../api';

const ChatPage = () => {
  const [partners, setPartners] = useState([]);
  const [activePartnerId, setActivePartnerId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    if (activePartnerId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [activePartnerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchPartners = async () => {
    try {
      const res = await api.get(`/chat/partners/${userId}`);
      setPartners(res.data);
      if (res.data.length > 0) {
        setActivePartnerId(res.data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch partners", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/chat/${userId}/${activePartnerId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePartnerId) return;

    try {
      const res = await api.post('/chat', {
        senderId: userId,
        receiverId: activePartnerId,
        text: newMessage
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <InternalLayout title="Pesan & Komunikasi">
      <div className="card" style={{ padding: 0, height: 'calc(100vh - 120px)', display: 'flex', overflow: 'hidden' }}>
        
        {/* Sidebar Chat List */}
        <div style={{ width: '320px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: '#F8F9FA' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', background: 'white' }}>
            <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageCircle size={20} color="var(--primary-color)" /> Percakapan
            </h3>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input type="text" className="form-input" placeholder="Cari kontak..." style={{ paddingLeft: '36px', borderRadius: '20px' }} />
            </div>
          </div>
          
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {partners.length === 0 ? (
              <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>Belum ada kontak.</p>
            ) : (
              partners.map(p => (
                <div 
                  key={p.id}
                  onClick={() => setActivePartnerId(p.id)}
                  style={{ 
                    padding: '16px 20px', 
                    display: 'flex', alignItems: 'center', gap: '12px', 
                    cursor: 'pointer',
                    background: activePartnerId === p.id ? 'white' : 'transparent',
                    borderLeft: activePartnerId === p.id ? '4px solid var(--accent-green)' : '4px solid transparent',
                    borderBottom: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <User size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{p.username}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.role}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>
          {activePartnerId ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px', background: 'white' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <User size={20} />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0' }}>{partners.find(p => p.id === activePartnerId)?.username || 'Kontak'}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }}></div> Online
                  </span>
                </div>
              </div>

              {/* Messages Area */}
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#F8F9FA' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <span style={{ background: '#E0E0E0', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', color: '#616161' }}>
                    Percakapan Dimulai
                  </span>
                </div>

                {messages.map((msg, idx) => {
                  const isMe = msg.senderId.toString() === userId.toString();
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', marginBottom: '16px' }}>
                      <div style={{ 
                        maxWidth: '70%', 
                        padding: '12px 16px', 
                        borderRadius: isMe ? '16px 16px 0 16px' : '16px 16px 16px 0', 
                        background: isMe ? 'var(--primary-color)' : 'white',
                        color: isMe ? 'white' : 'var(--text-primary)',
                        border: isMe ? 'none' : '1px solid var(--border-color)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                      }}>
                        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>{msg.text}</p>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Area */}
              <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)', background: 'white' }}>
                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ketik pesan..." 
                    style={{ flex: 1, borderRadius: '24px', padding: '12px 20px' }}
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              <MessageCircle size={64} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <h3>Belum ada percakapan</h3>
              <p>Pilih kontak di sebelah kiri untuk mulai mengobrol.</p>
            </div>
          )}
        </div>

      </div>
    </InternalLayout>
  );
};

export default ChatPage;
