import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, DollarSign, Layers, CheckCircle2, Copy } from 'lucide-react';

export default function PaymentSection({ selectedLoan, paymentLogs, onMakePayment }) {
  const [idempotencyKey, setIdempotencyKey] = useState(`IDEMP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
  const [amount, setAmount] = useState(2588);
  const [isPaying, setIsPaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePay = async () => {
    setIsPaying(true);
    await onMakePayment(idempotencyKey, amount);
    setIsPaying(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(idempotencyKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
      
      {/* Razorpay Gateway Simulation Panel */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck style={{ color: 'var(--primary-light)' }} size={22} />
            Razorpay Idempotent Sandbox
          </h2>
          <span className="badge-pill badge-indigo">Distributed Lock Mode</span>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>
            X-Idempotency-Key Header
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={idempotencyKey}
              onChange={(e) => setIdempotencyKey(e.target.value)}
              className="input-custom font-mono"
              style={{ fontSize: '0.85rem', flex: 1 }}
            />
            <button onClick={handleCopy} className="btn-secondary" title="Copy Key">
              {copied ? <CheckCircle2 size={16} style={{ color: 'var(--success)' }} /> : <Copy size={16} />}
            </button>
            <button 
              onClick={() => setIdempotencyKey(`IDEMP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`)} 
              className="btn-secondary" 
              title="Generate Fresh Key"
            >
              <RefreshCw size={16} />
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: '1.4' }}>
            Sending duplicate requests with the exact same key returns instant cached response from Redis without duplicate charging.
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>
            Payment Amount (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="input-custom font-mono"
            style={{ fontSize: '1.15rem', fontWeight: 700 }}
          />
        </div>

        <button onClick={handlePay} disabled={isPaying} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          {isPaying ? <RefreshCw className="animate-spin" size={18} /> : <DollarSign size={18} />}
          Trigger Idempotent Payment
        </button>
      </div>

      {/* Idempotency Log Stream */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Layers style={{ color: 'var(--warning)' }} size={22} />
            Idempotency & Reconciliation Stream
          </h2>
          <span className="badge-pill badge-amber">{paymentLogs.length} Events</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '340px', overflowY: 'auto' }}>
          {paymentLogs.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>No payment requests submitted yet.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>Click "Trigger Idempotent Payment" above to test duplicate prevention.</p>
            </div>
          ) : (
            paymentLogs.map(log => (
              <div key={log.id} style={{ padding: '0.9rem 1.15rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 600 }}>{log.key}</span>
                  {log.replayed ? (
                    <span className="badge-pill badge-amber">Redis Cache Replayed</span>
                  ) : (
                    <span className="badge-pill badge-emerald">Fresh Processed</span>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span>Payment Ref: <span className="font-mono">{log.ref}</span></span>
                  <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{log.time} ms</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
