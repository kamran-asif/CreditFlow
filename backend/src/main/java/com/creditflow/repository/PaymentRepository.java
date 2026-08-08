package com.creditflow.repository;

import com.creditflow.model.Payment;
import com.creditflow.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByPaymentReference(String paymentReference);
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    Optional<Payment> findByIdempotencyKey(String idempotencyKey);
    List<Payment> findByLoanId(Long loanId);
    List<Payment> findByStatus(PaymentStatus status);
}
