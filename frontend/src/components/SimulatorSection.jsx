import React, { useState } from 'react';
import { Cpu, RefreshCw, Zap } from 'lucide-react';

export default function SimulatorSection({ onStartSimulation, isSimulating, progress, count }) {
  const [targetCount, setTargetCount] = useState(count || 10000);

  return (
    <div className="glass-card" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Cpu style={{ color: 'var(--warning-color)' }} size={28} />
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>10,000+ Event Kafka Load Simulator</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Simulates concurrent BNPL loan applications, payments, & webhook events</p>
        </div>
      </div>

      <div style={{ marginBottom: '1.75rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Target Event Count
        </label>
        <input
          type="number"
          value={targetCount}
          onChange={(e) => setTargetCount(Number(e.target.value))}
          style={{ width: '100%', padding: '0.875rem 1.125rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}
        />
      </div>

      {isSimulating && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            <span>Simulating Kafka Events...</span>
            <span className="font-mono" style={{ color: 'var(--warning-color)' }}>{progress} / {targetCount}</span>
          </div>
          <div style={{ width: '100%', height: '10px', borderRadius: '5px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <div style={{ width: `${(progress / targetCount) * 100}%`, height: '100%', background: 'linear-gradient(to right, #f59e0b, #10b981)', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      <button onClick={() => onStartSimulation(targetCount)} disabled={isSimulating} className="btn-gradient" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
        {isSimulating ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
        Execute 10K Event Load Test
      </button>
    </div>
  );
}
