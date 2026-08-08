package com.creditflow.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private BigDecimal creditLimit;

    @Column(nullable = false)
    private BigDecimal availableCredit;

    private Integer creditScore;

    private LocalDateTime createdAt = LocalDateTime.now();

    public User() {}

    public User(Long id, String email, String name, String phone, BigDecimal creditLimit, BigDecimal availableCredit, Integer creditScore, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.phone = phone;
        this.creditLimit = creditLimit;
        this.availableCredit = availableCredit;
        this.creditScore = creditScore;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String email;
        private String name;
        private String phone;
        private BigDecimal creditLimit;
        private BigDecimal availableCredit;
        private Integer creditScore;
        private LocalDateTime createdAt = LocalDateTime.now();

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public UserBuilder phone(String phone) { this.phone = phone; return this; }
        public UserBuilder creditLimit(BigDecimal creditLimit) { this.creditLimit = creditLimit; return this; }
        public UserBuilder availableCredit(BigDecimal availableCredit) { this.availableCredit = availableCredit; return this; }
        public UserBuilder creditScore(Integer creditScore) { this.creditScore = creditScore; return this; }
        public UserBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public User build() {
            return new User(id, email, name, phone, creditLimit, availableCredit, creditScore, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public BigDecimal getCreditLimit() { return creditLimit; }
    public void setCreditLimit(BigDecimal creditLimit) { this.creditLimit = creditLimit; }

    public BigDecimal getAvailableCredit() { return availableCredit; }
    public void setAvailableCredit(BigDecimal availableCredit) { this.availableCredit = availableCredit; }

    public Integer getCreditScore() { return creditScore; }
    public void setCreditScore(Integer creditScore) { this.creditScore = creditScore; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

