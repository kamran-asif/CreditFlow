import React, { useState } from 'react';
import { Zap, ShieldCheck, Lock, Mail, ArrowRight, KeyRound, UserCheck } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('borrower@creditflow.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('borrower');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin({ email, name: role === 'admin' ? 'System Administrator' : 'Kamran Asif', role, authProvider: 'email' });
      setIsLoading(false);
    }, 500);
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      onLogin({
        email: 'kamran.asif.dev@gmail.com',
        name: 'Kamran Asif',
        role: 'borrower',
        authProvider: 'google',
        picture: 'https://lh3.googleusercontent.com/a/default-user'
      });
      setIsGoogleLoading(false);
    }, 700);
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

        {/* Google OAuth Single Sign-On Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.07)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            transition: 'all 0.25s ease'
          }}
          className="btn-secondary"
        >
          {/* Official Google Multi-Color G SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          {isGoogleLoading ? 'Connecting to Google OAuth...' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OR EMAIL SIGN IN</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
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
                <span>Sign In with Password</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo One-Click Access Button */}
        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => onLogin({ email: 'borrower@creditflow.com', name: 'Kamran Asif', role: 'borrower', authProvider: 'demo' })}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <UserCheck size={14} style={{ color: 'var(--success)' }} /> Quick Demo Sign In (1-Click)
          </button>
        </div>

        {/* Security Footer Badges */}
        <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ShieldCheck size={13} style={{ color: 'var(--success)' }} /> 256-bit Encryption</span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><KeyRound size={13} style={{ color: 'var(--primary-light)' }} /> Google OAuth 2.0</span>
        </div>

      </div>

    </div>
  );
}
