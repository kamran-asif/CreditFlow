import React, { useState } from 'react';
import { Zap, ShieldCheck, Lock, Mail, ArrowRight, Sparkles, KeyRound, UserCheck } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('borrower@creditflow.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('borrower');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin({ email, name: role === 'admin' ? 'System Administrator' : 'Kamran Asif', role });
      setIsLoading(false);
    }, 600);
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)' }}>
        
        {/* Logo & Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'var(--primary-gradient)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)' }}>
            <Zap style={{ color: '#fff' }} size={30} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(to right, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
            Welcome to CreditFlow
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
            Secure BNPL & Financial Intelligence Portal
          </p>
        </div>

        {/* Quick Role Selection Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', padding: '0.35rem', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => { setRole('borrower'); setEmail('borrower@creditflow.com'); }}
            style={{
              padding: '0.6rem',
              borderRadius: '9px',
              border: 'none',
              background: role === 'borrower' ? 'var(--primary-gradient)' : 'transparent',
              color: role === 'borrower' ? '#fff' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Borrower Portal
          </button>
          <button
            type="button"
            onClick={() => { setRole('admin'); setEmail('admin@creditflow.com'); }}
            style={{
              padding: '0.6rem',
              borderRadius: '9px',
              border: 'none',
              background: role === 'admin' ? 'var(--primary-gradient)' : 'transparent',
              color: role === 'admin' ? '#fff' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Admin / Telemetry
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-custom"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="name@creditflow.com"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Password
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)', cursor: 'pointer' }}>Forgot?</span>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-custom"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '0.95rem' }}
          >
            {isLoading ? (
              <span>Authenticating JWT...</span>
            ) : (
              <>
                <span>Sign In to CreditFlow</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo One-Click Access Button */}
        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => onLogin({ email: 'borrower@creditflow.com', name: 'Kamran Asif', role: 'borrower' })}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <UserCheck size={14} style={{ color: 'var(--success)' }} /> Quick Demo Sign In (1-Click)
          </button>
        </div>

        {/* Security Footer Badges */}
        <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ShieldCheck size={13} style={{ color: 'var(--success)' }} /> 256-bit Encryption</span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><KeyRound size={13} style={{ color: 'var(--primary-light)' }} /> JWT Token Auth</span>
        </div>

      </div>

    </div>
  );
}
