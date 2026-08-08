package com.creditflow.idempotency;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Idempotent {
    String headerName() default "X-Idempotency-Key";
    long expireSeconds() default 86400; // 24 hours
}
