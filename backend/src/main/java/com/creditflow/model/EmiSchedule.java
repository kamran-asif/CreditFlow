package com.creditflow.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "emi_schedules")
public class EmiSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_id")
    @JsonIgnore
    private Loan loan;

    @Column(nullable = false)
    private Integer installmentNumber;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Column(nullable = false)
    private BigDecimal emiAmount;

    @Column(nullable = false)
    private BigDecimal principalComponent;

    @Column(nullable = false)
    private BigDecimal interestComponent;

    @Column(nullable = false)
    private Boolean isPaid;

    private LocalDate paidDate;

    public EmiSchedule() {}

    public EmiSchedule(Long id, Loan loan, Integer installmentNumber, LocalDate dueDate, BigDecimal emiAmount, BigDecimal principalComponent, BigDecimal interestComponent, Boolean isPaid, LocalDate paidDate) {
        this.id = id;
        this.loan = loan;
        this.installmentNumber = installmentNumber;
        this.dueDate = dueDate;
        this.emiAmount = emiAmount;
        this.principalComponent = principalComponent;
        this.interestComponent = interestComponent;
        this.isPaid = isPaid != null ? isPaid : false;
        this.paidDate = paidDate;
    }

    public static EmiScheduleBuilder builder() {
        return new EmiScheduleBuilder();
    }

    public static class EmiScheduleBuilder {
        private Long id;
        private Loan loan;
        private Integer installmentNumber;
        private LocalDate dueDate;
        private BigDecimal emiAmount;
        private BigDecimal principalComponent;
        private BigDecimal interestComponent;
        private Boolean isPaid = false;
        private LocalDate paidDate;

        public EmiScheduleBuilder id(Long id) { this.id = id; return this; }
        public EmiScheduleBuilder loan(Loan loan) { this.loan = loan; return this; }
        public EmiScheduleBuilder installmentNumber(Integer installmentNumber) { this.installmentNumber = installmentNumber; return this; }
        public EmiScheduleBuilder dueDate(LocalDate dueDate) { this.dueDate = dueDate; return this; }
        public EmiScheduleBuilder emiAmount(BigDecimal emiAmount) { this.emiAmount = emiAmount; return this; }
        public EmiScheduleBuilder principalComponent(BigDecimal principalComponent) { this.principalComponent = principalComponent; return this; }
        public EmiScheduleBuilder interestComponent(BigDecimal interestComponent) { this.interestComponent = interestComponent; return this; }
        public EmiScheduleBuilder isPaid(Boolean isPaid) { this.isPaid = isPaid; return this; }
        public EmiScheduleBuilder paidDate(LocalDate paidDate) { this.paidDate = paidDate; return this; }

        public EmiSchedule build() {
            return new EmiSchedule(id, loan, installmentNumber, dueDate, emiAmount, principalComponent, interestComponent, isPaid, paidDate);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Loan getLoan() { return loan; }
    public void setLoan(Loan loan) { this.loan = loan; }

    public Integer getInstallmentNumber() { return installmentNumber; }
    public void setInstallmentNumber(Integer installmentNumber) { this.installmentNumber = installmentNumber; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public BigDecimal getEmiAmount() { return emiAmount; }
    public void setEmiAmount(BigDecimal emiAmount) { this.emiAmount = emiAmount; }

    public BigDecimal getPrincipalComponent() { return principalComponent; }
    public void setPrincipalComponent(BigDecimal principalComponent) { this.principalComponent = principalComponent; }

    public BigDecimal getInterestComponent() { return interestComponent; }
    public void setInterestComponent(BigDecimal interestComponent) { this.interestComponent = interestComponent; }

    public Boolean getIsPaid() { return isPaid; }
    public void setIsPaid(Boolean isPaid) { this.isPaid = isPaid; }

    public LocalDate getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDate paidDate) { this.paidDate = paidDate; }
}
