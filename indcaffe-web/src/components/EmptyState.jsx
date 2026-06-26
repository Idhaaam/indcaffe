import React from 'react';
import { SearchX, Inbox } from 'lucide-react';

const EmptyState = ({ title, message, icon: Icon = Inbox }) => {
  return (
    <div style={{ padding: '64px 24px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-card)', border: '1px dashed var(--border-color)' }}>
      <div style={{ width: '80px', height: '80px', background: '#F5F5F5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
        <Icon size={40} color="var(--text-secondary)" opacity={0.5} />
      </div>
      <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ margin: 0, color: 'var(--text-secondary)', maxWidth: '400px', marginInline: 'auto' }}>
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
