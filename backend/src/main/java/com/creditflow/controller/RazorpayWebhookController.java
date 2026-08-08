package com.creditflow.controller;

import com.creditflow.service.RazorpayService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/webhooks/razorpay")
@CrossOrigin(origins = "*")
public class RazorpayWebhookController {

    private static final Logger log = LoggerFactory.getLogger(RazorpayWebhookController.class);

    private final RazorpayService razorpayService;

    public RazorpayWebhookController(RazorpayService razorpayService) {
        this.razorpayService = razorpayService;
    }

    @PostMapping
    public ResponseEntity<String> handleRazorpayWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature,
            @RequestHeader(value = "X-Razorpay-Event-Id", required = false) String eventId) {

        String id = eventId != null ? eventId : "evt_" + UUID.randomUUID().toString().substring(0, 8);
        String eventType = payload.contains("payment.failed") ? "payment.failed" : "payment.captured";

        razorpayService.handleWebhook(payload, signature, id, eventType);
        return ResponseEntity.ok("Webhook received and queued for processing");
    }
}
