import React, { useState } from 'react';
import { Bot, Zap, RefreshCw, Send } from 'lucide-react';

export default function AiSection({ chatMessages, onSendQuery, isAskingAi }) {
  const [query, setQuery] = useState('');

  const handleSend = (text) => {
    const q = text || query;
    if (!q.trim()) return;
    onSendQuery(q);
    setQuery('');
  };

  return (
    <div className="glass-card" style={{ padding: '1.75rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Bot style={{ color: 'var(--primary-accent)' }} size={24} />
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>RAG Borrower Support Assistant</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fast policy & foreclosure query lookup (&lt;120 ms target)</p>
          </div>
        </div>
        <span className="badge badge-indigo"><Zap size={12} /> Redis Cached RAG Engine</span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {['Foreclosure policy', 'EMI Interest terms', 'Grace period & late fees', 'Razorpay security'].map(q => (
          <button key={q} onClick={() => handleSend(q)} style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}>
            {q}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '300px', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem', marginBottom: '1.25rem' }}>
        {chatMessages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%', padding: '0.875rem 1.125rem',
              borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.sender === 'user' ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.05)',
              border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
              color: '#fff', fontSize: '0.925rem'
            }}>
              {msg.text}
            </div>
            {msg.sender === 'ai' && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                <span>Latency: <strong style={{ color: 'var(--success-color)' }}>{msg.latency || 18} ms</strong></span>
                <span>•</span>
                <span>Source: {msg.cached ? 'Redis Cache' : 'RAG Pipeline'}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Ask about BNPL policies, foreclosures, fees..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{ flex: 1, padding: '0.875rem 1.125rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.925rem' }}
        />
        <button onClick={() => handleSend()} disabled={isAskingAi} className="btn-gradient">
          {isAskingAi ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
}
