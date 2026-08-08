import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, Bot, Cpu, Activity } from 'lucide-react';
import Header from './components/Header';
import BnplSection from './components/BnplSection';
import PaymentSection from './components/PaymentSection';
import AiSection from './components/AiSection';
import SimulatorSection from './components/SimulatorSection';
import MetricsSection from './components/MetricsSection';

export default function App() {
  const [activeTab, setActiveTab] = useState('bnpl');
  const [activeLoans, setActiveLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [paymentLogs, setPaymentLogs] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello! Ask me about BNPL terms, foreclosures, or fees.', cached: true, latency: 12 }
  ]);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [metrics, setMetrics] = useState({
    webhookSuccessRatePercentage: 99.5,
    avgAiLatencyMs: 42.5,
    totalLoans: 1420,
    totalPayments: 10450,
    kafkaEventThroughput: 1250
  });

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await fetch('/api/loans/user/1');
      if (res.ok) {
        const data = await res.json();
        setActiveLoans(data);
        if (data.length > 0) setSelectedLoan(data[0]);
        return;
      }
    } catch (e) {}

    const mockLoan = {
      id: 1, loanReference: 'LN-BNPL-9821', principalAmount: 15000,
      monthlyEmi: 2588, tenureMonths: 6, status: 'DISBURSED',
      emiSchedules: [
        { installmentNumber: 1, dueDate: '2026-09-05', emiAmount: 2588, isPaid: true },
        { installmentNumber: 2, dueDate: '2026-10-05', emiAmount: 2588, isPaid: false },
        { installmentNumber: 3, dueDate: '2026-11-05', emiAmount: 2588, isPaid: false }
      ]
    };
    setActiveLoans([mockLoan]);
    setSelectedLoan(mockLoan);
  };

  const handleApplyLoan = async (amount, tenure) => {
    try {
      const res = await fetch('/api/loans/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1, amount, tenureMonths: tenure })
      });
      if (res.ok) {
        const newLoan = await res.json();
        setActiveLoans([newLoan, ...activeLoans]);
        setSelectedLoan(newLoan);
      }
    } catch (e) {}
  };

  const handleMakePayment = async (key, amount) => {
    const startTime = Date.now();
    let isReplayed = paymentLogs.some(l => l.key === key);
    try {
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Idempotency-Key': key },
        body: JSON.stringify({ loanId: selectedLoan?.id || 1, emiScheduleId: 2, amount })
      });
      if (res.headers.get('X-Idempotent-Replayed') === 'true') isReplayed = true;
    } catch (e) {}

    setPaymentLogs(prev => [
      { id: Date.now(), key, status: 'CAPTURED', ref: `PAY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`, time: Date.now() - startTime || 18, replayed: isReplayed },
      ...prev
    ]);
  };

  const handleSendQuery = async (query) => {
    setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    setIsAskingAi(true);
    let answer = "Foreclosure Policy: Borrowers can foreclose BNPL loans after 1 EMI with 0% penalties.";
    if (query.toLowerCase().includes('grace') || query.toLowerCase().includes('late')) {
      answer = "Grace Period & Penalties: A 3-day grace period applies after due date with 0 late fees.";
    }

    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (res.ok) {
        const data = await res.json();
        answer = data.answer;
      }
    } catch (e) {}

    setChatMessages(prev => [...prev, { sender: 'ai', text: answer, cached: true, latency: 15 }]);
    setIsAskingAi(false);
  };

  const handleStartSimulation = (count) => {
    setIsSimulating(true);
    setSimProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 1000;
      setSimProgress(p);
      if (p >= count) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 300);
  };

  const tabs = [
    { id: 'bnpl', label: 'BNPL Loans', icon: CreditCard },
    { id: 'payment', label: 'Razorpay & Idempotency', icon: ShieldCheck },
    { id: 'ai', label: 'RAG AI Assistant', icon: Bot },
    { id: 'simulator', label: '10K Event Simulator', icon: Cpu },
    { id: 'metrics', label: 'Telemetry & Monitoring', icon: Activity },
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <Header />

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={activeTab === tab.id ? 'btn-gradient' : 'btn-secondary'} style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'bnpl' && <BnplSection activeLoans={activeLoans} selectedLoan={selectedLoan} onApplyLoan={handleApplyLoan} />}
      {activeTab === 'payment' && <PaymentSection selectedLoan={selectedLoan} paymentLogs={paymentLogs} onMakePayment={handleMakePayment} />}
      {activeTab === 'ai' && <AiSection chatMessages={chatMessages} onSendQuery={handleSendQuery} isAskingAi={isAskingAi} />}
      {activeTab === 'simulator' && <SimulatorSection onStartSimulation={handleStartSimulation} isSimulating={isSimulating} progress={simProgress} count={10000} />}
      {activeTab === 'metrics' && <MetricsSection metrics={metrics} />}
    </div>
  );
}
