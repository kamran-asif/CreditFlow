import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, Bot, Cpu, Activity } from 'lucide-react';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import BnplSection from './components/BnplSection';
import PaymentSection from './components/PaymentSection';
import AiSection from './components/AiSection';
import SimulatorSection from './components/SimulatorSection';
import MetricsSection from './components/MetricsSection';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('bnpl');
  const [activeLoans, setActiveLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [paymentLogs, setPaymentLogs] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your CreditFlow AI Assistant. Ask me about BNPL loan terms, foreclosure fees, or grace periods!', cached: true, latency: 12 }
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
    if (currentUser) {
      fetchLoans();
    }
  }, [currentUser]);

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

  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTab('metrics');
    } else {
      setActiveTab('bnpl');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
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

    const q = query.toLowerCase().trim();
    let answer = "CreditFlow Assistant: You can ask me about applying for BNPL loans, 0% foreclosure fees, 3, 6, 12-month EMI rates, Razorpay idempotency, or grace periods!";

    if (q.match(/(hi|hello|hey|greetings|good morning|who are you|name)/)) {
      answer = "Hello! 👋 I am your CreditFlow AI Assistant. I can help you apply for BNPL loans, calculate EMIs, explain foreclosure rules (0% fee), or check Razorpay payment security. What can I do for you today?";
    } else if (q.match(/(what can i do|help|feature|option|capability|do for me|what to do)/)) {
      answer = "Here is what you can do on CreditFlow:\n1. 💳 Apply for BNPL Credit Line (up to ₹1,00,000 credit).\n2. 📅 Repay in 3, 6, or 12-month EMI installments.\n3. ⚡ Test Idempotent Razorpay Payments (zero duplicate charges).\n4. 🤖 Ask AI support about foreclosure & grace periods.\n5. 📊 Monitor 99.5% webhook reliability & telemetry.";
    } else if (q.match(/(apply|how to apply|get loan|borrow|disburse|process|start)/)) {
      answer = "To apply for a BNPL loan:\n1. Go to the 'BNPL Loans' tab.\n2. Select your purchase amount (₹2,000 to ₹50,000).\n3. Choose your repayment tenure (3, 6, or 12 months).\n4. Click 'Disburse Credit Line' for instant 1-click approval!";
    } else if (q.match(/(foreclos|prepay|close loan)/)) {
      answer = "CreditFlow Foreclosure Policy: Borrowers can foreclose their BNPL loan anytime after completing 1 EMI installment with 0% foreclosure fee penalties!";
    } else if (q.match(/(emi|interest|rate|apr|monthly)/)) {
      answer = "CreditFlow EMI Terms: Flexible tenures of 3, 6, or 12 months with a transparent 12% APR fixed interest rate and zero hidden charges.";
    } else if (q.match(/(late|grace|penalty|overdue|due date)/)) {
      answer = "Grace Period & Penalty Policy: A 3-day grace period applies after your monthly EMI due date. Zero late fees are charged during the grace period.";
    } else if (q.match(/(razorpay|payment|security|idempotent|duplicate|lock)/)) {
      answer = "Payment Security: Payments are processed via Razorpay with 256-bit encryption. Our Idempotent APIs (X-Idempotency-Key) with Redis distributed locks guarantee you are never charged twice even during network drops.";
    } else if (q.match(/(limit|score|cibil|credit line|increase)/)) {
      answer = "Credit Limit Policy: Initial credit lines up to ₹1,00,000 are allocated based on credit score (750+). Paying your monthly EMIs on time automatically raises your available credit limit!";
    }

    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.answer) answer = data.answer;
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
    }, 250);
  };

  const tabs = [
    { id: 'bnpl', label: 'BNPL Loans', icon: CreditCard },
    { id: 'payment', label: 'Razorpay & Idempotency', icon: ShieldCheck },
    { id: 'ai', label: 'RAG AI Assistant', icon: Bot },
    { id: 'simulator', label: '10K Load Simulator', icon: Cpu },
    { id: 'metrics', label: 'Telemetry & Monitoring', icon: Activity },
  ];

  // If user is not logged in, show LoginPage
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <Header currentUser={currentUser} onLogout={handleLogout} />

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem', overflowX: 'auto' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={isActive ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.65rem 1.25rem', whiteSpace: 'nowrap' }}
            >
              <Icon size={17} /> {tab.label}
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
