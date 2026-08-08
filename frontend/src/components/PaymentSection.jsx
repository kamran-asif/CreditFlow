import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, DollarSign, Layers } from 'lucide-react';

export default function PaymentSection({ selectedLoan, paymentLogs, onMakePayment }) {
  const [idempotencyKey, setIdempotencyKey] = useState(`IDEMP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
  const [amount, setAmount] = useState(2500);
  const [isPaying, setIsPaying] = useState(false);

  const handlePay = async () => {
    setIsPaying(true);
    await onMakePayment(idempotencyKey, amount);
    setIsPaying(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck style={{ color: '#818cf8' }} size={20} /> Razorpay Idempotent Gateway
        </h2>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>X-Idempotency-Key Header</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={idempotencyKey}
              onChange={(e) => setIdempotencyKey(e.target.value)}
              className="font-mono"
              style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.875rem' }}
            />
            <button onClick={() => setIdempotencyKey(`IDEMP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`)} className="btn-secondary">
              <RefreshCw size={16} />
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
            Submitting duplicate requests with the exact same key returns instant cached response from Redis without duplicate charges.
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Payment Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '1.125rem', fontWeight: 600 }}
          />
        </div>

        <button onClick={handlePay} disabled={isPaying} className="btn-gradient" style={{ width: '100%', justifyContent: 'center' }}>
          {isPaying ? <RefreshCw className="animate-spin" size={18} /> : <DollarSign size={18} />} Trigger Idempotent Payment
        </button>
      </div>

      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers style={{ color: 'var(--warning-color)' }} size={20} /> Live Idempotency & Reconciliation Stream
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '320px', overflowY: 'auto' }}>
          {paymentLogs.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No payment requests submitted yet. Click trigger above.</p> : paymentLogs.map(log => (
            <div key={log.id} style={{ padding: '0.875rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.key}</span>
                {log.replayed ? <span className="badge badge-warning">Redis Cache Replayed</span> : <span className="badge badge-success">Processed (Fresh)</span>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600 }}>
                <span>Ref: {log.ref}</span>
                <span style={{ color: 'var(--text-dim)' }}>{log.time} ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
