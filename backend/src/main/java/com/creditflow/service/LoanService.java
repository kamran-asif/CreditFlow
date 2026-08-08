package com.creditflow.service;

import com.creditflow.config.KafkaConfig;
import com.creditflow.model.*;
import com.creditflow.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class LoanService {

    private static final Logger log = LoggerFactory.getLogger(LoanService.class);

    private final LoanRepository loanRepository;
    private final EmiScheduleRepository emiScheduleRepository;
    private final UserRepository userRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public LoanService(LoanRepository loanRepository,
                       EmiScheduleRepository emiScheduleRepository,
                       UserRepository userRepository,
                       KafkaTemplate<String, String> kafkaTemplate) {
        this.loanRepository = loanRepository;
        this.emiScheduleRepository = emiScheduleRepository;
        this.userRepository = userRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Transactional
    public Loan applyForBnplLoan(Long userId, BigDecimal principalAmount, Integer tenureMonths) {
        User user = userRepository.findById(userId)
                .orElseGet(() -> userRepository.save(User.builder()
                        .name("Demo Borrower")
                        .email("borrower@creditflow.com")
                        .phone("+919876543210")
                        .creditLimit(new BigDecimal("100000.00"))
                        .availableCredit(new BigDecimal("100000.00"))
                        .creditScore(750)
                        .build()));

        if (user.getAvailableCredit().compareTo(principalAmount) < 0) {
            throw new IllegalArgumentException("Requested amount exceeds available credit limit");
        }

        BigDecimal annualRate = new BigDecimal("0.12");
        BigDecimal monthlyRate = annualRate.divide(new BigDecimal("12"), 6, RoundingMode.HALF_UP);
        BigDecimal monthlyEmi = calculateEmi(principalAmount, monthlyRate, tenureMonths);

        String loanRef = "LN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Loan loan = Loan.builder()
                .loanReference(loanRef)
                .userId(user.getId())
                .principalAmount(principalAmount)
                .interestRate(annualRate)
                .tenureMonths(tenureMonths)
                .monthlyEmi(monthlyEmi)
                .remainingBalance(principalAmount)
                .status(LoanStatus.APPROVED)
                .build();

        Loan savedLoan = loanRepository.save(loan);

        List<EmiSchedule> schedules = new ArrayList<>();
        BigDecimal remainingPrincipal = principalAmount;
        LocalDate today = LocalDate.now();

        for (int i = 1; i <= tenureMonths; i++) {
            BigDecimal interestComponent = remainingPrincipal.multiply(monthlyRate).setScale(2, RoundingMode.HALF_UP);
            BigDecimal principalComponent = monthlyEmi.subtract(interestComponent).setScale(2, RoundingMode.HALF_UP);

            if (i == tenureMonths) {
                principalComponent = remainingPrincipal;
                monthlyEmi = principalComponent.add(interestComponent);
            }

            remainingPrincipal = remainingPrincipal.subtract(principalComponent);

            EmiSchedule schedule = EmiSchedule.builder()
                    .loan(savedLoan)
                    .installmentNumber(i)
                    .dueDate(today.plusMonths(i))
                    .emiAmount(monthlyEmi)
                    .principalComponent(principalComponent)
                    .interestComponent(interestComponent)
                    .isPaid(false)
                    .build();

            schedules.add(schedule);
        }

        emiScheduleRepository.saveAll(schedules);
        savedLoan.setEmiSchedules(schedules);
        savedLoan.setStatus(LoanStatus.DISBURSED);

        user.setAvailableCredit(user.getAvailableCredit().subtract(principalAmount));
        userRepository.save(user);

        kafkaTemplate.send(KafkaConfig.LOAN_EVENTS_TOPIC, loanRef, "LOAN_CREATED:" + savedLoan.getId());
        log.info("Successfully disbursed BNPL Loan {} for amount {}", loanRef, principalAmount);

        return savedLoan;
    }

    public List<Loan> getLoansByUser(Long userId) {
        return loanRepository.findByUserId(userId);
    }

    public Loan getLoanByRef(String loanRef) {
        return loanRepository.findByLoanReference(loanRef)
                .orElseThrow(() -> new IllegalArgumentException("Loan not found: " + loanRef));
    }

    private BigDecimal calculateEmi(BigDecimal principal, BigDecimal monthlyRate, int months) {
        double p = principal.doubleValue();
        double r = monthlyRate.doubleValue();
        double emi = (p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
        return BigDecimal.valueOf(emi).setScale(2, RoundingMode.HALF_UP);
    }
}
