package com.exp.tracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.exp.tracker.entity.EMI;

@Repository
public interface EMIRepository extends JpaRepository<EMI, Long> {
    List<EMI> findByStatus(String status);
}


