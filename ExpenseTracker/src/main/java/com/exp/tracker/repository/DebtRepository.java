package com.exp.tracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.exp.tracker.entity.Debt;

@Repository
public interface DebtRepository extends JpaRepository<Debt, Long> {
    List<Debt> findByStatus(String status);
    List<Debt> findByPriority(String priority);
}