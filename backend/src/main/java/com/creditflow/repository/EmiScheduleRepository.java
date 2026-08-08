package com.creditflow.repository;

import com.creditflow.model.EmiSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EmiScheduleRepository extends JpaRepository<EmiSchedule, Long> {
    List<EmiSchedule> findByLoanId(Long loanId);
    List<EmiSchedule> findByLoanIdAndIsPaidFalseOrderByInstallmentNumberAsc(Long loanId);
}
