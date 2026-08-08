package com.creditflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "webhook_event_logs")
public class WebhookEventLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String eventId;

    @Column(nullable = false)
    private String eventType;

    @Column(columnDefinition = "TEXT")
    private String payload;

    @Column(nullable = false)
    private Boolean processed;

    private String failureReason;

    private LocalDateTime receivedAt = LocalDateTime.now();
    private LocalDateTime processedAt;

    public WebhookEventLog() {}

    public WebhookEventLog(Long id, String eventId, String eventType, String payload, Boolean processed, String failureReason, LocalDateTime receivedAt, LocalDateTime processedAt) {
        this.id = id;
        this.eventId = eventId;
        this.eventType = eventType;
        this.payload = payload;
        this.processed = processed != null ? processed : false;
        this.failureReason = failureReason;
        this.receivedAt = receivedAt != null ? receivedAt : LocalDateTime.now();
        this.processedAt = processedAt;
    }

    public static WebhookEventLogBuilder builder() {
        return new WebhookEventLogBuilder();
    }

    public static class WebhookEventLogBuilder {
        private Long id;
        private String eventId;
        private String eventType;
        private String payload;
        private Boolean processed = false;
        private String failureReason;
        private LocalDateTime receivedAt = LocalDateTime.now();
        private LocalDateTime processedAt;

        public WebhookEventLogBuilder id(Long id) { this.id = id; return this; }
        public WebhookEventLogBuilder eventId(String eventId) { this.eventId = eventId; return this; }
        public WebhookEventLogBuilder eventType(String eventType) { this.eventType = eventType; return this; }
        public WebhookEventLogBuilder payload(String payload) { this.payload = payload; return this; }
        public WebhookEventLogBuilder processed(Boolean processed) { this.processed = processed; return this; }
        public WebhookEventLogBuilder failureReason(String failureReason) { this.failureReason = failureReason; return this; }
        public WebhookEventLogBuilder receivedAt(LocalDateTime receivedAt) { this.receivedAt = receivedAt; return this; }
        public WebhookEventLogBuilder processedAt(LocalDateTime processedAt) { this.processedAt = processedAt; return this; }

        public WebhookEventLog build() {
            return new WebhookEventLog(id, eventId, eventType, payload, processed, failureReason, receivedAt, processedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }

    public Boolean getProcessed() { return processed; }
    public void setProcessed(Boolean processed) { this.processed = processed; }

    public String getFailureReason() { return failureReason; }
    public void setFailureReason(String failureReason) { this.failureReason = failureReason; }

    public LocalDateTime getReceivedAt() { return receivedAt; }
    public void setReceivedAt(LocalDateTime receivedAt) { this.receivedAt = receivedAt; }

    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }
}
