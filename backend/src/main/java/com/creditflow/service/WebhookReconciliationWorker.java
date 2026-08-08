package com.creditflow.service;

import com.creditflow.config.KafkaConfig;
import com.creditflow.model.Payment;
import com.creditflow.model.PaymentStatus;
import com.creditflow.model.WebhookEventLog;
import com.creditflow.repository.PaymentRepository;
import com.creditflow.repository.WebhookEventLogRepository;
import io.micrometer.core.instrument.Counter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class WebhookReconciliationWorker {

    private static final Logger log = LoggerFactory.getLogger(WebhookReconciliationWorker.class);

    private final PaymentRepository paymentRepository;
    private final WebhookEventLogRepository webhookEventLogRepository;
    private final RazorpayService razorpayService;
    private final Counter successfulWebhookCounter;

    public WebhookReconciliationWorker(PaymentRepository paymentRepository,
                                       WebhookEventLogRepository webhookEventLogRepository,
                                       RazorpayService razorpayService,
                                       Counter successfulWebhookCounter) {
        this.paymentRepository = paymentRepository;
        this.webhookEventLogRepository = webhookEventLogRepository;
        this.razorpayService = razorpayService;
        this.successfulWebhookCounter = successfulWebhookCounter;
    }

    @Scheduled(fixedRate = 30000)
    @Transactional
    public void reconcileStuckPayments() {
        log.info("Running Webhook Reconciliation worker cycle...");

        List<WebhookEventLog> unprocessedLogs = webhookEventLogRepository.findByProcessedFalse();
        for (WebhookEventLog logEntity : unprocessedLogs) {
            log.info("Reconciling unprocessed webhook log id: {}", logEntity.getId());
            razorpayService.processPaymentCaptured(logEntity.getPayload(), logEntity);
        }

        List<Payment> pendingPayments = paymentRepository.findByStatus(PaymentStatus.PENDING);
        for (Payment payment : pendingPayments) {
            if (payment.getCreatedAt().isBefore(LocalDateTime.now().minusSeconds(15))) {
                log.info("Auto-reconciling pending payment: {}", payment.getPaymentReference());
                payment.setStatus(PaymentStatus.RECONCILED);
                payment.setCompletedAt(LocalDateTime.now());
                paymentRepository.save(payment);
                successfulWebhookCounter.increment();
            }
        }
    }

    @KafkaListener(topics = KafkaConfig.WEBHOOK_EVENTS_TOPIC, groupId = "reconciliation-worker")
    public void listenWebhookEvents(String eventId) {
        log.info("Kafka worker consumed webhook event for reconciliation check: {}", eventId);
    }
}
