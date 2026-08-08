package com.creditflow.service;

import com.creditflow.config.KafkaConfig;
import io.micrometer.core.instrument.Counter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class LoadSimulatorService {

    private static final Logger log = LoggerFactory.getLogger(LoadSimulatorService.class);

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final RazorpayService razorpayService;
    private final Counter totalEventsSimulatedCounter;

    private boolean isSimulating = false;
    private int eventsProcessed = 0;

    public LoadSimulatorService(KafkaTemplate<String, String> kafkaTemplate,
                                RazorpayService razorpayService,
                                Counter totalEventsSimulatedCounter) {
        this.kafkaTemplate = kafkaTemplate;
        this.razorpayService = razorpayService;
        this.totalEventsSimulatedCounter = totalEventsSimulatedCounter;
    }

    @Async
    public void runSimulation(int targetEvents) {
        isSimulating = true;
        eventsProcessed = 0;
        log.info("Starting load simulation for {} loan and payment events...", targetEvents);

        for (int i = 1; i <= targetEvents && isSimulating; i++) {
            String eventId = "evt_sim_" + UUID.randomUUID().toString().substring(0, 8);
            String loanRef = "LN-SIM-" + (1000 + i);

            kafkaTemplate.send(KafkaConfig.LOAN_EVENTS_TOPIC, loanRef, "SIMULATED_LOAN_APPLICATION:" + i);
            
            String orderId = "order_sim_" + i;
            String payload = String.format("{\"event\":\"payment.captured\",\"payload\":{\"payment\":{\"entity\":{\"id\":\"pay_sim_%d\",\"order_id\":\"%s\",\"amount\":150000,\"status\":\"captured\"}}}}", i, orderId);

            razorpayService.handleWebhook(payload, "mock_signature_ok", eventId, "payment.captured");

            eventsProcessed++;
            totalEventsSimulatedCounter.increment();

            if (i % 1000 == 0) {
                log.info("Simulated {} / {} events", i, targetEvents);
            }
        }

        isSimulating = false;
        log.info("Load simulation completed. Total events processed: {}", eventsProcessed);
    }

    public Map<String, Object> getSimulationStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("isSimulating", isSimulating);
        status.put("eventsProcessed", eventsProcessed);
        return status;
    }

    public void stopSimulation() {
        this.isSimulating = false;
    }
}
