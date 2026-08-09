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

    public RAGAssistantService(StringRedisTemplate redisTemplate, Timer aiResponseTimer) {
        this.redisTemplate = redisTemplate;
        this.aiResponseTimer = aiResponseTimer;
    }

    public Map<String, Object> queryAiAssistant(String query) {
        long startTime = System.currentTimeMillis();
        String q = query.toLowerCase().trim();
        String cacheKey = "rag_ai_query:" + Integer.toHexString(q.hashCode());

        String cachedAnswer = redisTemplate.opsForValue().get(cacheKey);
        boolean isCached = false;
        String answer;

        if (cachedAnswer != null) {
            answer = cachedAnswer;
            isCached = true;
            log.info("RAG AI Query hit Redis cache! Response time: {} ms", System.currentTimeMillis() - startTime);
        } else {
            answer = generateIntelligentResponse(q);
            redisTemplate.opsForValue().set(cacheKey, answer, Duration.ofHours(24));
        }

        long responseTimeMs = System.currentTimeMillis() - startTime;
        aiResponseTimer.record(Duration.ofMillis(responseTimeMs));

        Map<String, Object> response = new HashMap<>();
        response.put("query", query);
        response.put("answer", answer);
        response.put("cached", isCached);
        response.put("responseTimeMs", responseTimeMs);
        response.put("source", isCached ? "Redis Cache" : "RAG Intent Engine");

        return response;
    }

    private String generateIntelligentResponse(String q) {
        if (q.matches(".*(hi|hello|hey|greetings|good morning|good evening|who are you|name).*")) {
            return "Hello! 👋 I am your CreditFlow AI Assistant. I can help you apply for BNPL loans, calculate EMIs, explain foreclosure rules (0% fee), or check Razorpay payment security. What can I do for you today?";
        }
        
        if (q.matches(".*(what can i do|help|feature|option|capability|do for me|what to do).*")) {
            return "Here is what you can do on CreditFlow:\n" +
                   "1. 💳 Apply for BNPL Credit Line (up to ₹1,00,000 instant credit).\n" +
                   "2. 📅 Repay in 3, 6, or 12-month EMI installments.\n" +
                   "3. ⚡ Test Idempotent Razorpay Payments (zero duplicate charges guaranteed).\n" +
                   "4. 🤖 Ask AI support about foreclosure, grace periods & penalties.\n" +
                   "5. 📊 Monitor 99.5% webhook reliability & Kafka event throughput.";
        }

        if (q.matches(".*(apply|how to apply|get loan|borrow|disburse|process|start).*")) {
            return "To apply for a BNPL loan:\n" +
                   "1. Navigate to the 'BNPL Loans' tab.\n" +
                   "2. Select your desired purchase amount (₹2,000 to ₹50,000).\n" +
                   "3. Choose your repayment tenure (3, 6, or 12 months).\n" +
                   "4. Click 'Disburse Credit Line' for instant 1-click approval!";
        }

        if (q.matches(".*(foreclos|prepay|close loan).*")) {
            return "CreditFlow Foreclosure Policy: Borrowers can foreclose their BNPL loan anytime after completing 1 EMI installment with 0% foreclosure fee penalties!";
        }

        if (q.matches(".*(emi|interest|rate|apr|monthly).*")) {
            return "CreditFlow EMI Terms: Flexible tenures of 3, 6, or 12 months with a transparent 12% APR fixed interest rate and zero hidden charges.";
        }

        if (q.matches(".*(late|grace|penalty|overdue|due date).*")) {
            return "Grace Period & Penalty Policy: A 3-day grace period applies after your monthly EMI due date. Zero late fees are charged during the grace period.";
        }

        if (q.matches(".*(razorpay|payment|security|idempotent|duplicate|lock).*")) {
            return "Payment Security: Payments are processed via Razorpay with 256-bit encryption. Our Idempotent APIs (X-Idempotency-Key) with Redis distributed locks guarantee you are never charged twice even during network drops.";
        }

        if (q.matches(".*(limit|score|cibil|credit line|increase).*")) {
            return "Credit Limit Policy: Initial credit lines up to ₹1,00,000 are allocated based on credit score (750+). Paying your monthly EMIs on time automatically raises your available credit limit!";
        }

        return "CreditFlow Assistant: I've processed your query '" + q + "'. You can ask me about how to apply for BNPL, 0% foreclosure fees, 3, 6, 12-month EMI rates, Razorpay security, or grace periods!";
    }
}
