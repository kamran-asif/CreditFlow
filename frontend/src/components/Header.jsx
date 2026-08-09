import React from 'react';
import { Zap, Clock, Layers, ShieldCheck, Server, LogOut, User } from 'lucide-react';

export default function Header({ currentUser, onLogout }) {
  return (
    <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '0.75rem', borderRadius: '16px', background: 'var(--primary-gradient)', display: 'flex', boxShadow: '0 0 25px rgba(99, 102, 241, 0.5)' }}>
          <Zap style={{ color: '#fff' }} size={28} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, background: 'linear-gradient(to right, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
              CreditFlow
            </h1>
            <span className="badge-pill badge-emerald" style={{ fontSize: '0.65rem' }}>v1.0 Production</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.15rem' }}>
            BNPL Lifecycle Platform & High-Reliability Payment Infrastructure
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="badge-pill badge-emerald">
          <span className="pulse-indicator"></span>
          <ShieldCheck size={13} /> Webhook 99.5%+
        </div>
        <div className="badge-pill badge-indigo">
          <Clock size={13} /> RAG &lt; 120ms
        </div>

        {/* Logged in user profile & logout button */}
        {currentUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.4rem 0.85rem', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={15} style={{ color: 'var(--primary-light)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{currentUser.name}</span>
            </div>
            <button
              onClick={onLogout}
              className="btn-secondary"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '8px' }}
              title="Sign Out"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
