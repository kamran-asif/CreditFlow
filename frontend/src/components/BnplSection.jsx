import React, { useState } from 'react';
import { CreditCard, ArrowRight, RefreshCw, Database, Check, Clock } from 'lucide-react';

export default function BnplSection({ activeLoans, selectedLoan, onApplyLoan }) {
  const [loanAmount, setLoanAmount] = useState(15000);
  const [tenure, setTenure] = useState(6);
  const [isApplying, setIsApplying] = useState(false);

  const calculateEmi = (p, months) => {
    const r = 0.12 / 12;
    return Math.round((p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
  };

  const handleApply = async () => {
    setIsApplying(true);
    await onApplyLoan(loanAmount, tenure);
    setIsApplying(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CreditCard style={{ color: 'var(--primary-accent)' }} size={20} /> Instant BNPL Checkout
        </h2>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Purchase Amount (₹)</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '1.125rem', fontWeight: 600 }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Tenure (Months)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {[3, 6, 12].map(t => (
              <button
                key={t}
                onClick={() => setTenure(t)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: tenure === t ? '2px solid var(--primary-accent)' : '1px solid var(--border-color)',
                  background: tenure === t ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                  color: tenure === t ? '#fff' : 'var(--text-muted)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {t} Mo
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <span>Monthly EMI</span>
            <span style={{ color: '#fff', fontWeight: 700 }}>₹{calculateEmi(loanAmount, tenure).toLocaleString()} / mo</span>
          </div>
        </div>

        <button onClick={handleApply} disabled={isApplying} className="btn-gradient" style={{ width: '100%', justifyContent: 'center' }}>
          {isApplying ? <RefreshCw className="animate-spin" size={18} /> : <ArrowRight size={18} />} Disburse Credit Line
        </button>
      </div>

      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database style={{ color: 'var(--success-color)' }} size={20} /> Active Loans
        </h2>
        {selectedLoan ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span className="font-mono" style={{ fontSize: '0.875rem', color: 'var(--primary-accent)' }}>{selectedLoan.loanReference}</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>₹{selectedLoan.principalAmount?.toLocaleString()}</h3>
              </div>
              <span className="badge badge-success">{selectedLoan.status}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '240px', overflowY: 'auto' }}>
              {selectedLoan.emiSchedules?.map((emi, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>EMI #{emi.installmentNumber} • {emi.dueDate}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹{emi.emiAmount}</div>
                  </div>
                  {emi.isPaid ? <span className="badge badge-success"><Check size={12} /> Paid</span> : <span className="badge badge-warning"><Clock size={12} /> Pending</span>}
                </div>
              ))}
            </div>
          </div>
        ) : <p style={{ color: 'var(--text-muted)' }}>No active loans found.</p>}
      </div>
    </div>
  );
}
