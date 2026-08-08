package com.creditflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "idempotency_logs")
public class IdempotencyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String idempotencyKey;

    private String requestHash;

    @Column(columnDefinition = "TEXT")
    private String responseBody;

    private Integer statusCode;

    private LocalDateTime createdAt = LocalDateTime.now();

    public IdempotencyLog() {}

    public IdempotencyLog(Long id, String idempotencyKey, String requestHash, String responseBody, Integer statusCode, LocalDateTime createdAt) {
        this.id = id;
        this.idempotencyKey = idempotencyKey;
        this.requestHash = requestHash;
        this.responseBody = responseBody;
        this.statusCode = statusCode;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static IdempotencyLogBuilder builder() {
        return new IdempotencyLogBuilder();
    }

    public static class IdempotencyLogBuilder {
        private Long id;
        private String idempotencyKey;
        private String requestHash;
        private String responseBody;
        private Integer statusCode;
        private LocalDateTime createdAt = LocalDateTime.now();

        public IdempotencyLogBuilder id(Long id) { this.id = id; return this; }
        public IdempotencyLogBuilder idempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; return this; }
        public IdempotencyLogBuilder requestHash(String requestHash) { this.requestHash = requestHash; return this; }
        public IdempotencyLogBuilder responseBody(String responseBody) { this.responseBody = responseBody; return this; }
        public IdempotencyLogBuilder statusCode(Integer statusCode) { this.statusCode = statusCode; return this; }
        public IdempotencyLogBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public IdempotencyLog build() {
            return new IdempotencyLog(id, idempotencyKey, requestHash, responseBody, statusCode, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }

    public String getRequestHash() { return requestHash; }
    public void setRequestHash(String requestHash) { this.requestHash = requestHash; }

    public String getResponseBody() { return responseBody; }
    public void setResponseBody(String responseBody) { this.responseBody = responseBody; }

    public Integer getStatusCode() { return statusCode; }
    public void setStatusCode(Integer statusCode) { this.statusCode = statusCode; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
