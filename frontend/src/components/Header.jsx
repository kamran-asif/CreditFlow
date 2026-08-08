import React from 'react';
import { Zap, Clock, Layers } from 'lucide-react';

export default function Header() {
  return (
    <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'var(--primary-gradient)', display: 'flex' }}>
          <Zap style={{ color: '#fff' }} size={26} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CreditFlow
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            BNPL Lifecycle Platform & High-Reliability Payment Engine
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span className="badge badge-success"><span className="pulse-dot"></span> Webhook 99.5%+</span>
        <span className="badge badge-indigo"><Clock size={12} /> RAG &lt; 120ms</span>
        <span className="badge badge-warning"><Layers size={12} /> Kafka 10K+ Load</span>
      </div>
    </header>
  );
}
