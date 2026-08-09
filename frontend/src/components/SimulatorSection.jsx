import React, { useState } from 'react';
import { Cpu, RefreshCw, Zap, Layers, Play, CheckCircle2 } from 'lucide-react';

export default function SimulatorSection({ onStartSimulation, isSimulating, progress, count }) {
  const [targetCount, setTargetCount] = useState(count || 10000);

  return (
    <div className="glass-card" style={{ padding: '2.25rem', maxWidth: '820px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
        <div style={{ padding: '0.75rem', borderRadius: '16px', background: 'var(--amber-gradient)', display: 'flex', boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)' }}>
          <Cpu style={{ color: '#fff' }} size={28} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>10,000+ Event Kafka Load Simulator</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Simulates concurrent BNPL loan applications, payments & webhook events</p>
        </div>
      </div>

      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Target Event Volume</label>
          <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--warning)' }}>{targetCount.toLocaleString()} Events</span>
        </div>
        <input
          type="range"
          min="1000"
          max="50000"
          step="1000"
          value={targetCount}
          onChange={(e) => setTargetCount(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--warning)', cursor: 'pointer' }}
        />
      </div>

      {isSimulating && (
        <div style={{ marginBottom: '1.75rem', padding: '1.25rem', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <RefreshCw className="animate-spin" size={15} style={{ color: 'var(--warning)' }} /> Simulating Kafka Event Ingestion...
            </span>
            <span className="font-mono" style={{ fontWeight: 800, color: 'var(--warning)' }}>{progress.toLocaleString()} / {targetCount.toLocaleString()}</span>
          </div>
          <div style={{ width: '100%', height: '10px', borderRadius: '5px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{ width: `${(progress / targetCount) * 100}%`, height: '100%', background: 'var(--amber-gradient)', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      <button 
        onClick={() => onStartSimulation(targetCount)} 
        disabled={isSimulating} 
        className="btn-primary" 
        style={{ width: '100%', justifyContent: 'center', padding: '1rem', background: 'var(--amber-gradient)', boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)' }}
      >
        {isSimulating ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
        Execute {targetCount.toLocaleString()} Event Load Test
      </button>

    </div>
  );
}
