package com.creditflow.repository;

import com.creditflow.model.Loan;
import com.creditflow.model.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    Optional<Loan> findByLoanReference(String loanReference);
    List<Loan> findByUserId(Long userId);
    List<Loan> findByStatus(LoanStatus status);
}
