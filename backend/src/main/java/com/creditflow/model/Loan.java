package com.creditflow.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "loans")
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String loanReference;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private BigDecimal principalAmount;

    @Column(nullable = false)
    private BigDecimal interestRate;

    @Column(nullable = false)
    private Integer tenureMonths;

    @Column(nullable = false)
    private BigDecimal monthlyEmi;

    @Column(nullable = false)
    private BigDecimal remainingBalance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoanStatus status;

    @OneToMany(mappedBy = "loan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EmiSchedule> emiSchedules = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    public Loan() {}

    public Loan(Long id, String loanReference, Long userId, BigDecimal principalAmount, BigDecimal interestRate, Integer tenureMonths, BigDecimal monthlyEmi, BigDecimal remainingBalance, LoanStatus status, List<EmiSchedule> emiSchedules, LocalDateTime createdAt) {
        this.id = id;
        this.loanReference = loanReference;
        this.userId = userId;
        this.principalAmount = principalAmount;
        this.interestRate = interestRate;
        this.tenureMonths = tenureMonths;
        this.monthlyEmi = monthlyEmi;
        this.remainingBalance = remainingBalance;
        this.status = status;
        this.emiSchedules = emiSchedules != null ? emiSchedules : new ArrayList<>();
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static LoanBuilder builder() {
        return new LoanBuilder();
    }

    public static class LoanBuilder {
        private Long id;
        private String loanReference;
        private Long userId;
        private BigDecimal principalAmount;
        private BigDecimal interestRate;
        private Integer tenureMonths;
        private BigDecimal monthlyEmi;
        private BigDecimal remainingBalance;
        private LoanStatus status;
        private List<EmiSchedule> emiSchedules = new ArrayList<>();
        private LocalDateTime createdAt = LocalDateTime.now();

        public LoanBuilder id(Long id) { this.id = id; return this; }
        public LoanBuilder loanReference(String loanReference) { this.loanReference = loanReference; return this; }
        public LoanBuilder userId(Long userId) { this.userId = userId; return this; }
        public LoanBuilder principalAmount(BigDecimal principalAmount) { this.principalAmount = principalAmount; return this; }
        public LoanBuilder interestRate(BigDecimal interestRate) { this.interestRate = interestRate; return this; }
        public LoanBuilder tenureMonths(Integer tenureMonths) { this.tenureMonths = tenureMonths; return this; }
        public LoanBuilder monthlyEmi(BigDecimal monthlyEmi) { this.monthlyEmi = monthlyEmi; return this; }
        public LoanBuilder remainingBalance(BigDecimal remainingBalance) { this.remainingBalance = remainingBalance; return this; }
        public LoanBuilder status(LoanStatus status) { this.status = status; return this; }
        public LoanBuilder emiSchedules(List<EmiSchedule> emiSchedules) { this.emiSchedules = emiSchedules; return this; }
        public LoanBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Loan build() {
            return new Loan(id, loanReference, userId, principalAmount, interestRate, tenureMonths, monthlyEmi, remainingBalance, status, emiSchedules, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLoanReference() { return loanReference; }
    public void setLoanReference(String loanReference) { this.loanReference = loanReference; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public BigDecimal getPrincipalAmount() { return principalAmount; }
    public void setPrincipalAmount(BigDecimal principalAmount) { this.principalAmount = principalAmount; }

    public BigDecimal getInterestRate() { return interestRate; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }

    public Integer getTenureMonths() { return tenureMonths; }
    public void setTenureMonths(Integer tenureMonths) { this.tenureMonths = tenureMonths; }

    public BigDecimal getMonthlyEmi() { return monthlyEmi; }
    public void setMonthlyEmi(BigDecimal monthlyEmi) { this.monthlyEmi = monthlyEmi; }

    public BigDecimal getRemainingBalance() { return remainingBalance; }
    public void setRemainingBalance(BigDecimal remainingBalance) { this.remainingBalance = remainingBalance; }

    public LoanStatus getStatus() { return status; }
    public void setStatus(LoanStatus status) { this.status = status; }

    public List<EmiSchedule> getEmiSchedules() { return emiSchedules; }
    public void setEmiSchedules(List<EmiSchedule> emiSchedules) { this.emiSchedules = emiSchedules; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
