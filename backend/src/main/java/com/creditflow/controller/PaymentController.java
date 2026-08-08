package com.creditflow.controller;

import com.creditflow.idempotency.Idempotent;
import com.creditflow.model.Payment;
import com.creditflow.service.RazorpayService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final RazorpayService razorpayService;

    public PaymentController(RazorpayService razorpayService) {
        this.razorpayService = razorpayService;
    }

    @PostMapping("/initiate")
    @Idempotent(headerName = "X-Idempotency-Key")
    public ResponseEntity<Payment> initiatePayment(
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody PaymentInitiationRequest request) {

        Payment payment = razorpayService.initiatePayment(
                request.getLoanId(),
                request.getEmiScheduleId(),
                request.getAmount(),
                idempotencyKey
        );
        return ResponseEntity.ok(payment);
    }

    public static class PaymentInitiationRequest {
        private Long loanId;
        private Long emiScheduleId;
        private BigDecimal amount;

        public PaymentInitiationRequest() {}

        public Long getLoanId() { return loanId; }
        public void setLoanId(Long loanId) { this.loanId = loanId; }

        public Long getEmiScheduleId() { return emiScheduleId; }
        public void setEmiScheduleId(Long emiScheduleId) { this.emiScheduleId = emiScheduleId; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
    }
}
