import React from 'react';
import { ShieldCheck, Clock, Layers, Activity } from 'lucide-react';

export default function MetricsSection({ metrics }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          <span>Webhook Success Rate</span>
          <ShieldCheck size={20} style={{ color: 'var(--success-color)' }} />
        </div>
        <h3 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--success-color)' }}>
          {metrics.webhookSuccessRatePercentage}%
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
          Target: 99.5% (Achieved via Webhook Reconciliation Worker)
        </p>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          <span>Avg AI Latency</span>
          <Clock size={20} style={{ color: 'var(--primary-accent)' }} />
        </div>
        <h3 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary-accent)' }}>
          {metrics.avgAiLatencyMs} ms
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
          Target: &lt; 120 ms (Optimized via Redis Cache)
        </p>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          <span>Total Simulated Events</span>
          <Layers size={20} style={{ color: 'var(--warning-color)' }} />
        </div>
        <h3 style={{ fontSize: '2.25rem', fontWeight: 800 }}>
          {metrics.totalPayments?.toLocaleString()}+
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
          Processed through Kafka brokers
        </p>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          <span>Event Throughput</span>
          <Activity size={20} style={{ color: '#818cf8' }} />
        </div>
        <h3 style={{ fontSize: '2.25rem', fontWeight: 800 }}>
          {metrics.kafkaEventThroughput} msg/sec
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
          Kafka partitions: 3 (Consumer Group active)
        </p>
      </div>
    </div>
  );
}
