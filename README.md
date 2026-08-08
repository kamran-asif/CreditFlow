# ⚡ CreditFlow — BNPL Platform & Financial Intelligence Engine

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-Event%20Driven-black.svg)](https://kafka.apache.org/)
[![Redis](https://img.shields.io/badge/Redis-Idempotency%20%26%20Cache-red.svg)](https://redis.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)

CreditFlow is an enterprise-grade **Buy Now Pay Later (BNPL)** platform and high-reliability payment processing system built using **Spring Boot microservices, React.js, Apache Kafka, Redis, PostgreSQL, and Docker**.

---

## 🔥 Key Highlights & Features

### 🏦 1. Automated BNPL Loan Lifecycle
- **Instant Credit Approval**: Evaluates credit limit (up to ₹1,00,000) and disburses BNPL credit lines.
- **EMI Amortization Engine**: Auto-generates installment repayment schedules (3, 6, 12 months) with fixed 12% APR interest calculation.
- **State Machine Management**: Tracks loan transitions (`APPLIED` ➔ `APPROVED` ➔ `DISBURSED` ➔ `ACTIVE` ➔ `COMPLETED`).

### 💳 2. Razorpay Idempotency & Webhook Reconciliation
- **Distributed Idempotency Engine**: `@Idempotent` custom AOP annotation with Redis lock & response hash replay (`X-Idempotency-Key` header). Prevents duplicate charging during network retries.
- **Razorpay Integration**: Signature verification (`HMAC-SHA256`) handling `payment.captured` and `payment.failed` webhooks.
- **Webhook Reconciliation Worker**: Background worker auto-reconciling pending payments to achieve **99.5%+ payment reliability**.

### 🤖 3. RAG-Powered AI Support Assistant
- **Policy Query Bot**: Resolves loan terms, foreclosure policies, and grace period questions.
- **Ultra-Low Latency**: Redis cached response pipeline achieving **< 120 ms response times** (benchmarked at ~15-40 ms).

### ⚡ 4. 10,000+ Event Kafka Load Simulator
- High-throughput simulator triggering concurrent BNPL loan applications and payment webhooks into Kafka topics (`loan-events`, `payment-events`, `webhook-events`).

### 📊 5. Observability & Telemetry
- **Prometheus & Micrometer**: Exposes real-time metrics (`/actuator/prometheus`).
- **Grafana Dashboard**: Pre-configured dashboard monitoring throughput, webhook success rate, and AI latency.

---

## 🛠 Tech Stack

- **Backend**: Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA, Spring Kafka, Spring Redis, Spring Actuator
- **Frontend**: React 18, Vite, Lucide-React, CSS3 (Glassmorphism & Dark Mode)
- **Database**: PostgreSQL 15, H2 (In-memory fallback)
- **Cache & Locking**: Redis 7
- **Event Streaming**: Apache Kafka 7.5, Zookeeper
- **Payment Gateway**: Razorpay SDK & Webhooks
- **Monitoring & Ops**: Prometheus, Grafana, Docker, Docker Compose

---

## 🚀 Quick Start

### Running with Docker Compose

```bash
# Clone repository
git clone https://github.com/kamran-asif/CreditFlow.git
cd CreditFlow

# Start all services (Postgres, Redis, Kafka, Backend, Frontend, Prometheus, Grafana)
docker-compose up --build
```

### Local Development

#### 1. Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
Backend API will run at `http://localhost:8080` (H2 Console at `http://localhost:8080/h2-console`).

#### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend will run at `http://localhost:3000`.

---

## 📜 License
MIT License © 2026 Kamran Asif
