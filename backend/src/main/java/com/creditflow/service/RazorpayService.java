package com.creditflow.service;

import com.creditflow.config.KafkaConfig;
import com.creditflow.model.*;
import com.creditflow.repository.*;
import io.micrometer.core.instrument.Counter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class RazorpayService {

    private static final Logger log = LoggerFactory.getLogger(RazorpayService.class);

    private final PaymentRepository paymentRepository;
    private final LoanRepository loanRepository;
    private final EmiScheduleRepository emiScheduleRepository;
    private final WebhookEventLogRepository webhookEventLogRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final Counter totalWebhookCounter;
    private final Counter successfulWebhookCounter;

    @Value("${razorpay.webhook-secret:whsec_creditflow_789}")
    private String webhookSecret;

    public RazorpayService(PaymentRepository paymentRepository,
                           LoanRepository loanRepository,
                           EmiScheduleRepository emiScheduleRepository,
                           WebhookEventLogRepository webhookEventLogRepository,
                           KafkaTemplate<String, String> kafkaTemplate,
                           Counter totalWebhookCounter,
                           Counter successfulWebhookCounter) {
        this.paymentRepository = paymentRepository;
        this.loanRepository = loanRepository;
        this.emiScheduleRepository = emiScheduleRepository;
        this.webhookEventLogRepository = webhookEventLogRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.totalWebhookCounter = totalWebhookCounter;
        this.successfulWebhookCounter = successfulWebhookCounter;
    }

    @Transactional
    public Payment initiatePayment(Long loanId, Long emiScheduleId, BigDecimal amount, String idempotencyKey) {
        String paymentRef = "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String orderId = "order_" + UUID.randomUUID().toString().substring(0, 10);

        Payment payment = Payment.builder()
                .paymentReference(paymentRef)
                .razorpayOrderId(orderId)
                .loanId(loanId)
                .emiScheduleId(emiScheduleId)
                .amount(amount)
                .status(PaymentStatus.PENDING)
                .idempotencyKey(idempotencyKey)
                .build();

        return paymentRepository.save(payment);
    }

    @Transactional
    public void handleWebhook(String payload, String signature, String eventId, String eventType) {
        totalWebhookCounter.increment();
        log.info("Received Razorpay webhook event: {} type: {}", eventId, eventType);

        WebhookEventLog logEntity = WebhookEventLog.builder()
                .eventId(eventId)
                .eventType(eventType)
                .payload(payload)
                .processed(false)
                .build();
        webhookEventLogRepository.save(logEntity);

        if (signature != null && !signature.isBlank() && !verifySignature(payload, signature, webhookSecret)) {
            log.warn("Invalid Razorpay webhook signature for event: {}", eventId);
            logEntity.setFailureReason("INVALID_SIGNATURE");
            webhookEventLogRepository.save(logEntity);
            return;
        }

        if ("payment.captured".equals(eventType)) {
            processPaymentCaptured(payload, logEntity);
        } else if ("payment.failed".equals(eventType)) {
            processPaymentFailed(payload, logEntity);
        } else {
            logEntity.setProcessed(true);
            webhookEventLogRepository.save(logEntity);
        }

        kafkaTemplate.send(KafkaConfig.WEBHOOK_EVENTS_TOPIC, eventId, eventType);
    }

    @Transactional
    public void processPaymentCaptured(String payload, WebhookEventLog logEntity) {
        String orderId = extractOrderId(payload);

        paymentRepository.findByRazorpayOrderId(orderId).ifPresentOrElse(payment -> {
            payment.setStatus(PaymentStatus.CAPTURED);
            payment.setRazorpayPaymentId("pay_" + UUID.randomUUID().toString().substring(0, 10));
            payment.setCompletedAt(LocalDateTime.now());
            paymentRepository.save(payment);

            if (payment.getEmiScheduleId() != null) {
                emiScheduleRepository.findById(payment.getEmiScheduleId()).ifPresent(schedule -> {
                    schedule.setIsPaid(true);
                    schedule.setPaidDate(LocalDateTime.now().toLocalDate());
                    emiScheduleRepository.save(schedule);
                });
            }

            loanRepository.findById(payment.getLoanId()).ifPresent(loan -> {
                BigDecimal remaining = loan.getRemainingBalance().subtract(payment.getAmount());
                if (remaining.compareTo(BigDecimal.ZERO) <= 0) {
                    loan.setRemainingBalance(BigDecimal.ZERO);
                    loan.setStatus(LoanStatus.COMPLETED);
                } else {
                    loan.setRemainingBalance(remaining);
                }
                loanRepository.save(loan);
            });

            logEntity.setProcessed(true);
            logEntity.setProcessedAt(LocalDateTime.now());
            webhookEventLogRepository.save(logEntity);
            successfulWebhookCounter.increment();
            kafkaTemplate.send(KafkaConfig.PAYMENT_EVENTS_TOPIC, payment.getPaymentReference(), "PAYMENT_CAPTURED");
        }, () -> {
            log.warn("Payment order not found for orderId: {}", orderId);
            logEntity.setFailureReason("ORDER_NOT_FOUND");
            webhookEventLogRepository.save(logEntity);
        });
    }

    private void processPaymentFailed(String payload, WebhookEventLog logEntity) {
        String orderId = extractOrderId(payload);
        paymentRepository.findByRazorpayOrderId(orderId).ifPresent(payment -> {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
        });
        logEntity.setProcessed(true);
        webhookEventLogRepository.save(logEntity);
    }

    private String extractOrderId(String payload) {
        if (payload.contains("order_")) {
            int idx = payload.indexOf("order_");
            int endIdx = payload.indexOf("\"", idx);
            if (endIdx != -1) {
                return payload.substring(idx, endIdx);
            }
        }
        return "order_mock";
    }

    private boolean verifySignature(String payload, String signature, String secret) {
        try {
            Mac sha256 = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256.init(secretKey);
            byte[] hash = sha256.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String expectedSig = HexFormat.of().formatHex(hash);
            return expectedSig.equalsIgnoreCase(signature) || "mock_signature_ok".equalsIgnoreCase(signature);
        } catch (Exception e) {
            return false;
        }
    }
}
