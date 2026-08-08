package com.creditflow.controller;

import com.creditflow.model.Loan;
import com.creditflow.service.LoanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "*")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping("/apply")
    public ResponseEntity<Loan> applyForLoan(@RequestBody LoanApplicationRequest request) {
        Loan loan = loanService.applyForBnplLoan(
                request.getUserId() != null ? request.getUserId() : 1L,
                request.getAmount(),
                request.getTenureMonths()
        );
        return ResponseEntity.ok(loan);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Loan>> getUserLoans(@PathVariable Long userId) {
        return ResponseEntity.ok(loanService.getLoansByUser(userId));
    }

    @GetMapping("/{loanRef}")
    public ResponseEntity<Loan> getLoanByRef(@PathVariable String loanRef) {
        return ResponseEntity.ok(loanService.getLoanByRef(loanRef));
    }

    public static class LoanApplicationRequest {
        private Long userId;
        private BigDecimal amount;
        private Integer tenureMonths;

        public LoanApplicationRequest() {}

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }

        public Integer getTenureMonths() { return tenureMonths; }
        public void setTenureMonths(Integer tenureMonths) { this.tenureMonths = tenureMonths; }
    }
}
