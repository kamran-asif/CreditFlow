package com.creditflow.repository;

import com.creditflow.model.WebhookEventLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WebhookEventLogRepository extends JpaRepository<WebhookEventLog, Long> {
    Optional<WebhookEventLog> findByEventId(String eventId);
    List<WebhookEventLog> findByProcessedFalse();
}
