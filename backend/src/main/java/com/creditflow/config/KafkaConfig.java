package com.creditflow.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    public static final String LOAN_EVENTS_TOPIC = "loan-events";
    public static final String PAYMENT_EVENTS_TOPIC = "payment-events";
    public static final String WEBHOOK_EVENTS_TOPIC = "webhook-events";
    public static final String RECONCILIATION_TOPIC = "reconciliation-events";

    @Bean
    public NewTopic loanEventsTopic() {
        return TopicBuilder.name(LOAN_EVENTS_TOPIC).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic paymentEventsTopic() {
        return TopicBuilder.name(PAYMENT_EVENTS_TOPIC).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic webhookEventsTopic() {
        return TopicBuilder.name(WEBHOOK_EVENTS_TOPIC).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic reconciliationTopic() {
        return TopicBuilder.name(RECONCILIATION_TOPIC).partitions(3).replicas(1).build();
    }
}
