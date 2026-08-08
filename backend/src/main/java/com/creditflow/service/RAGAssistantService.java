package com.creditflow.service;

import io.micrometer.core.instrument.Timer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class RAGAssistantService {

    private static final Logger log = LoggerFactory.getLogger(RAGAssistantService.class);

    private final StringRedisTemplate redisTemplate;
    private final Timer aiResponseTimer;

    private static final Map<String, String> POLICY_KNOWLEDGE_BASE = new HashMap<>();

    static {
        POLICY_KNOWLEDGE_BASE.put("foreclosure", 
            "CreditFlow Foreclosure Policy: Borrowers can foreclose their BNPL loan after completing 1 EMI installment with 0% foreclosure fee penalties. Contact support or submit a foreclosure request directly in your dashboard.");
        POLICY_KNOWLEDGE_BASE.put("emi", 
            "CreditFlow EMI Terms: Flexible repayment tenures of 3, 6, or 12 months with transparent 12% APR interest rate. Payments are due on the 5th of each month.");
        POLICY_KNOWLEDGE_BASE.put("credit", 
            "Credit Limit Policy: Instant BNPL credit lines up to ₹1,00,000 based on credit score. Repaying EMIs on time automatically raises your available credit limit.");
        POLICY_KNOWLEDGE_BASE.put("razorpay", 
            "Payment Processing: Payments are secured via Razorpay with 256-bit encryption. Idempotent APIs guarantee no duplicate charges even during network dropouts.");
        POLICY_KNOWLEDGE_BASE.put("late", 
            "Grace Period & Penalties: A 3-day grace period applies after the due date. No late fees are charged during the grace period.");
    }

    public RAGAssistantService(StringRedisTemplate redisTemplate, Timer aiResponseTimer) {
        this.redisTemplate = redisTemplate;
        this.aiResponseTimer = aiResponseTimer;
    }

    public Map<String, Object> queryAiAssistant(String query) {
        long startTime = System.currentTimeMillis();
        String normalizedQuery = query.toLowerCase().trim();
        String cacheKey = "rag_ai_query:" + Integer.toHexString(normalizedQuery.hashCode());

        String cachedAnswer = redisTemplate.opsForValue().get(cacheKey);
        boolean isCached = false;
        String answer;

        if (cachedAnswer != null) {
            answer = cachedAnswer;
            isCached = true;
            log.info("RAG AI Query hit Redis cache! Response time: {} ms", System.currentTimeMillis() - startTime);
        } else {
            answer = POLICY_KNOWLEDGE_BASE.entrySet().stream()
                    .filter(entry -> normalizedQuery.contains(entry.getKey()))
                    .map(Map.Entry::getValue)
                    .findFirst()
                    .orElse("CreditFlow Assistant: " + query + ". For detailed assistance, please refer to your active loan schedule or contact support@creditflow.com.");

            redisTemplate.opsForValue().set(cacheKey, answer, Duration.ofHours(24));
        }

        long responseTimeMs = System.currentTimeMillis() - startTime;
        aiResponseTimer.record(Duration.ofMillis(responseTimeMs));

        Map<String, Object> response = new HashMap<>();
        response.put("query", query);
        response.put("answer", answer);
        response.put("cached", isCached);
        response.put("responseTimeMs", responseTimeMs);
        response.put("source", isCached ? "Redis Cache" : "RAG Policy Engine");

        return response;
    }
}
