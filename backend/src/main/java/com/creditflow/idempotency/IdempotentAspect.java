package com.creditflow.idempotency;

import com.creditflow.model.IdempotencyLog;
import com.creditflow.repository.IdempotencyLogRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Duration;
import java.util.Optional;

@Aspect
@Component
public class IdempotentAspect {

    private static final Logger log = LoggerFactory.getLogger(IdempotentAspect.class);

    private final StringRedisTemplate redisTemplate;
    private final IdempotencyLogRepository idempotencyLogRepository;
    private final ObjectMapper objectMapper;

    public IdempotentAspect(StringRedisTemplate redisTemplate,
                            IdempotencyLogRepository idempotencyLogRepository,
                            ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.idempotencyLogRepository = idempotencyLogRepository;
        this.objectMapper = objectMapper;
    }

    @Around("@annotation(idempotent)")
    public Object handleIdempotency(ProceedingJoinPoint joinPoint, Idempotent idempotent) throws Throwable {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return joinPoint.proceed();
        }

        HttpServletRequest request = attributes.getRequest();
        String idempotencyKey = request.getHeader(idempotent.headerName());

        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            return joinPoint.proceed();
        }

        String redisLockKey = "idempotency_lock:" + idempotencyKey;
        String redisCacheKey = "idempotency_cache:" + idempotencyKey;

        String cachedResponseBody = redisTemplate.opsForValue().get(redisCacheKey);
        if (cachedResponseBody != null) {
            log.info("Idempotent hit from Redis for key: {}", idempotencyKey);
            return ResponseEntity.ok()
                    .header("X-Idempotent-Replayed", "true")
                    .body(objectMapper.readValue(cachedResponseBody, Object.class));
        }

        Optional<IdempotencyLog> dbLog = idempotencyLogRepository.findByIdempotencyKey(idempotencyKey);
        if (dbLog.isPresent()) {
            log.info("Idempotent hit from DB for key: {}", idempotencyKey);
            Object body = objectMapper.readValue(dbLog.get().getResponseBody(), Object.class);
            redisTemplate.opsForValue().set(redisCacheKey, dbLog.get().getResponseBody(), Duration.ofSeconds(idempotent.expireSeconds()));
            return ResponseEntity.status(dbLog.get().getStatusCode())
                    .header("X-Idempotent-Replayed", "true")
                    .body(body);
        }

        Boolean acquired = redisTemplate.opsForValue().setIfAbsent(redisLockKey, "LOCKED", Duration.ofSeconds(30));
        if (Boolean.FALSE.equals(acquired)) {
            log.warn("Concurrent request detected for idempotency key: {}", idempotencyKey);
            return ResponseEntity.status(409).body("Concurrent request in progress for key: " + idempotencyKey);
        }

        try {
            Object result = joinPoint.proceed();

            String jsonResponse = objectMapper.writeValueAsString(result);
            if (result instanceof ResponseEntity<?> responseEntity) {
                if (responseEntity.getBody() != null) {
                    jsonResponse = objectMapper.writeValueAsString(responseEntity.getBody());
                }
            }

            redisTemplate.opsForValue().set(redisCacheKey, jsonResponse, Duration.ofSeconds(idempotent.expireSeconds()));
            idempotencyLogRepository.save(IdempotencyLog.builder()
                    .idempotencyKey(idempotencyKey)
                    .responseBody(jsonResponse)
                    .statusCode(200)
                    .build());

            return result;
        } finally {
            redisTemplate.delete(redisLockKey);
        }
    }
}
