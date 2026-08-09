import React, { useState } from 'react';
import { CreditCard, ArrowRight, RefreshCw, Database, Check, Clock, Wallet, ShieldAlert, Sparkles } from 'lucide-react';

export default function BnplSection({ activeLoans, selectedLoan, onApplyLoan }) {
  const [loanAmount, setLoanAmount] = useState(15000);
  const [tenure, setTenure] = useState(6);
  const [isApplying, setIsApplying] = useState(false);

  const availableCredit = 85000;
  const totalLimit = 100000;
  const creditPercent = (availableCredit / totalLimit) * 100;

  const calculateEmi = (p, months) => {
    const r = 0.12 / 12;
    return Math.round((p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
  };

  const monthlyEmi = calculateEmi(loanAmount, tenure);

  const handleApply = async () => {
    setIsApplying(true);
    await onApplyLoan(loanAmount, tenure);
    setIsApplying(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
      
      {/* BNPL Application Form */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CreditCard style={{ color: 'var(--primary-light)' }} size={22} />
            Instant BNPL Checkout
          </h2>
          <span className="badge-pill badge-indigo">
            <Sparkles size={12} /> Instant Approval
          </span>
        </div>

        {/* Available Credit Limit Widget */}
        <div style={{ padding: '1rem 1.25rem', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Wallet size={15} style={{ color: 'var(--success)' }} /> Approved Credit Line
            </span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{availableCredit.toLocaleString()} / ₹{totalLimit.toLocaleString()}</span>
          </div>
          <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{ width: `${creditPercent}%`, height: '100%', background: 'var(--emerald-gradient)', transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Loan Amount Input & Slider */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Purchase Amount</label>
            <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-light)' }}>₹{loanAmount.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="2000"
            max="50000"
            step="1000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)', marginBottom: '0.75rem', cursor: 'pointer' }}
          />
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="input-custom font-mono"
            style={{ fontWeight: 700 }}
          />
        </div>

        {/* Tenure Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.6rem' }}>
            Repayment Tenure
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
            {[3, 6, 12].map(t => (
              <button
                key={t}
                onClick={() => setTenure(t)}
                style={{
                  padding: '0.85rem 0.5rem',
                  borderRadius: '12px',
                  border: tenure === t ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: tenure === t ? 'rgba(99, 102, 241, 0.18)' : 'rgba(255,255,255,0.03)',
                  color: tenure === t ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {t} Months
              </button>
            ))}
          </div>
        </div>

        {/* EMI Calculation Summary */}
        <div style={{ padding: '1.15rem', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Calculated Monthly EMI</span>
            <span className="font-mono" style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}>₹{monthlyEmi.toLocaleString()} / mo</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Interest Rate</span>
            <span style={{ color: 'var(--success)', fontWeight: 700 }}>12% Fixed APR (0% Hidden Fees)</span>
          </div>
        </div>

        <button onClick={handleApply} disabled={isApplying} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          {isApplying ? <RefreshCw className="animate-spin" size={18} /> : <ArrowRight size={18} />}
          Disburse BNPL Credit Line
        </button>
      </div>

      {/* Active Loans & EMI Schedule Breakdown */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Database style={{ color: 'var(--success)' }} size={22} />
            Active BNPL Credit Lines
          </h2>
          <span className="badge-pill badge-emerald">
            {activeLoans?.length || 1} Active
          </span>
        </div>

        {selectedLoan ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loan Reference</div>
                <span className="font-mono" style={{ fontSize: '1.1rem', color: 'var(--primary-light)', fontWeight: 700 }}>{selectedLoan.loanReference}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Principal Disbursed</div>
                <h3 className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800 }}>₹{selectedLoan.principalAmount?.toLocaleString()}</h3>
              </div>
            </div>

            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              EMI Installment Schedule
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '280px', overflowY: 'auto' }}>
              {selectedLoan.emiSchedules?.map((emi, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.15rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>EMI #{emi.installmentNumber} • Due {emi.dueDate}</div>
                    <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>Amount: ₹{emi.emiAmount}</div>
                  </div>
                  {emi.isPaid ? (
                    <span className="badge-pill badge-emerald"><Check size={13} /> Paid</span>
                  ) : (
                    <span className="badge-pill badge-amber"><Clock size={13} /> Pending</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No active loans found.</p>
        )}
      </div>

    </div>
  );
}
