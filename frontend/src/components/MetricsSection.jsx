import React from 'react';
import { ShieldCheck, Clock, Layers, Activity, Server, CheckCircle2 } from 'lucide-react';

export default function MetricsSection({ metrics }) {
  return (
    <div>
      {/* 4 Stat KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.85rem', fontSize: '0.85rem' }}>
            <span>Webhook Reliability</span>
            <ShieldCheck size={20} style={{ color: 'var(--success)' }} />
          </div>
          <h3 className="font-mono" style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--success)' }}>
            {metrics.webhookSuccessRatePercentage}%
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Target: 99.5%+ (Reconciliation Worker)
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.85rem', fontSize: '0.85rem' }}>
            <span>Avg AI Latency</span>
            <Clock size={20} style={{ color: 'var(--primary-light)' }} />
          </div>
          <h3 className="font-mono" style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-light)' }}>
            {metrics.avgAiLatencyMs} ms
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Target: &lt; 120 ms (Redis Cache Engine)
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.85rem', fontSize: '0.85rem' }}>
            <span>Simulated Events</span>
            <Layers size={20} style={{ color: 'var(--warning)' }} />
          </div>
          <h3 className="font-mono" style={{ fontSize: '2.4rem', fontWeight: 800 }}>
            {metrics.totalPayments?.toLocaleString()}+
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Processed via Apache Kafka
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.85rem', fontSize: '0.85rem' }}>
            <span>Kafka Throughput</span>
            <Activity size={20} style={{ color: '#06b6d4' }} />
          </div>
          <h3 className="font-mono" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#06b6d4' }}>
            {metrics.kafkaEventThroughput} msg/s
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            3 Active Kafka Partitions
          </p>
        </div>

      </div>

      {/* Microservice Node Health Matrix */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Server size={20} style={{ color: 'var(--success)' }} />
          Microservice Architecture Health Matrix
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { name: 'Loan Service', status: 'Healthy', port: '8080' },
            { name: 'Payment Gateway', status: 'Healthy', port: '8080' },
            { name: 'Webhook Worker', status: 'Active', port: 'Background' },
            { name: 'RAG AI Assistant', status: 'Cached', port: '8080' },
            { name: 'Kafka Broker', status: 'Healthy', port: '9092' },
            { name: 'Redis Cache', status: 'Connected', port: '6379' },
            { name: 'PostgreSQL DB', status: 'Connected', port: '5432' },
            { name: 'Prometheus Node', status: 'Scraping', port: '9090' },
          ].map((svc, i) => (
            <div key={i} style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{svc.name}</div>
                <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Port: {svc.port}</div>
              </div>
              <span className="badge-pill badge-emerald" style={{ fontSize: '0.65rem' }}>
                <CheckCircle2 size={11} /> {svc.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
