package com.creditflow.config;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MetricsConfig {

    @Bean
    public Counter totalWebhookCounter(MeterRegistry registry) {
        return Counter.builder("creditflow_webhook_total")
                .description("Total incoming webhooks received")
                .register(registry);
    }

    @Bean
    public Counter successfulWebhookCounter(MeterRegistry registry) {
        return Counter.builder("creditflow_webhook_success")
                .description("Total successfully processed or reconciled webhooks")
                .register(registry);
    }

    @Bean
    public Counter totalEventsSimulatedCounter(MeterRegistry registry) {
        return Counter.builder("creditflow_events_simulated_total")
                .description("Total load simulator events generated")
                .register(registry);
    }

    @Bean
    public Timer aiResponseTimer(MeterRegistry registry) {
        return Timer.builder("creditflow_ai_response_time")
                .description("AI Assistant response time latency")
                .register(registry);
    }
}
