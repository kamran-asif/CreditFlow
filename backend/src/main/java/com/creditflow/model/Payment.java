package com.creditflow.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String paymentReference;

    private String razorpayOrderId;
    private String razorpayPaymentId;

    @Column(nullable = false)
    private Long loanId;

    private Long emiScheduleId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    private String idempotencyKey;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime completedAt;

    public Payment() {}

    public Payment(Long id, String paymentReference, String razorpayOrderId, String razorpayPaymentId, Long loanId, Long emiScheduleId, BigDecimal amount, PaymentStatus status, String idempotencyKey, LocalDateTime createdAt, LocalDateTime completedAt) {
        this.id = id;
        this.paymentReference = paymentReference;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.loanId = loanId;
        this.emiScheduleId = emiScheduleId;
        this.amount = amount;
        this.status = status;
        this.idempotencyKey = idempotencyKey;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.completedAt = completedAt;
    }

    public static PaymentBuilder builder() {
        return new PaymentBuilder();
    }

    public static class PaymentBuilder {
        private Long id;
        private String paymentReference;
        private String razorpayOrderId;
        private String razorpayPaymentId;
        private Long loanId;
        private Long emiScheduleId;
        private BigDecimal amount;
        private PaymentStatus status;
        private String idempotencyKey;
        private LocalDateTime createdAt = LocalDateTime.now();
        private LocalDateTime completedAt;

        public PaymentBuilder id(Long id) { this.id = id; return this; }
        public PaymentBuilder paymentReference(String paymentReference) { this.paymentReference = paymentReference; return this; }
        public PaymentBuilder razorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; return this; }
        public PaymentBuilder razorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; return this; }
        public PaymentBuilder loanId(Long loanId) { this.loanId = loanId; return this; }
        public PaymentBuilder emiScheduleId(Long emiScheduleId) { this.emiScheduleId = emiScheduleId; return this; }
        public PaymentBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public PaymentBuilder status(PaymentStatus status) { this.status = status; return this; }
        public PaymentBuilder idempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; return this; }
        public PaymentBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public PaymentBuilder completedAt(LocalDateTime completedAt) { this.completedAt = completedAt; return this; }

        public Payment build() {
            return new Payment(id, paymentReference, razorpayOrderId, razorpayPaymentId, loanId, emiScheduleId, amount, status, idempotencyKey, createdAt, completedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }

    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }

    public Long getLoanId() { return loanId; }
    public void setLoanId(Long loanId) { this.loanId = loanId; }

    public Long getEmiScheduleId() { return emiScheduleId; }
    public void setEmiScheduleId(Long emiScheduleId) { this.emiScheduleId = emiScheduleId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
