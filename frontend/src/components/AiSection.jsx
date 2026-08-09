import React, { useState } from 'react';
import { Bot, Zap, RefreshCw, Send, Sparkles } from 'lucide-react';

export default function AiSection({ chatMessages, onSendQuery, isAskingAi }) {
  const [query, setQuery] = useState('');

  const handleSend = (text) => {
    const q = text || query;
    if (!q.trim()) return;
    onSendQuery(q);
    setQuery('');
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', maxWidth: '820px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ padding: '0.6rem', borderRadius: '14px', background: 'var(--primary-gradient)', display: 'flex' }}>
            <Bot style={{ color: '#fff' }} size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>RAG Borrower Support Assistant</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Instant policy, foreclosure & loan terms lookup (&lt;120 ms target)</p>
          </div>
        </div>
        <span className="badge-pill badge-indigo">
          <Zap size={12} /> Redis Cached RAG
        </span>
      </div>

      {/* Quick Suggested Chips */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {['What can I do?', 'How to apply?', 'Foreclosure policy', 'EMI Interest terms', 'Grace period'].map(chip => (
          <button
            key={chip}
            onClick={() => handleSend(chip)}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={12} style={{ color: 'var(--primary-light)' }} /> {chip}
          </button>
        ))}
      </div>

      {/* Chat Conversation Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '300px', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem', marginBottom: '1.25rem' }}>
        {chatMessages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%',
              padding: '0.9rem 1.25rem',
              borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.sender === 'user' ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.05)',
              border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '0.925rem',
              lineHeight: '1.5',
              whiteSpace: 'pre-line'
            }}>
              {msg.text}
            </div>
            {msg.sender === 'ai' && (
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Latency: <strong style={{ color: 'var(--success)' }}>{msg.latency || 18} ms</strong></span>
                <span>•</span>
                <span>Source: {msg.cached ? 'Redis Cache' : 'RAG Intent Engine'}</span>
              </div>
            )}
          </div>
        ))}
        {isAskingAi && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <RefreshCw className="animate-spin" size={16} /> RAG Assistant querying policy vector store...
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <input
          type="text"
          placeholder="Ask anything (e.g., 'hey', 'what can I do?', 'how to apply?')..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="input-custom"
          style={{ flex: 1 }}
        />
        <button onClick={() => handleSend()} disabled={isAskingAi} className="btn-primary">
          {isAskingAi ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </div>

    </div>
  );
}
