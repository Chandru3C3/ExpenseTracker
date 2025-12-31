package com.exp.tracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "debts")
public class Debt {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(nullable = false)
    private String debtName;
    
    @NotNull
    @Column(nullable = false)
    private String creditor;
    
    @NotNull
    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;
    
    @Column(name = "paid_amount")
    private BigDecimal paidAmount;
    
    @Column(name = "remaining_amount")
    private BigDecimal remainingAmount;
    
    @NotNull
    @Column(name = "interest_rate", nullable = false)
    private BigDecimal interestRate;
    
    @NotNull
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;
    
    @Column(name = "status")
    private String status; // PENDING, PARTIAL, PAID
    
    @Column(name = "priority")
    private String priority; // HIGH, MEDIUM, LOW

    public Debt() {
        this.paidAmount = BigDecimal.ZERO;
        this.status = "PENDING";
        this.priority = "MEDIUM";
    }

    public Debt(Long id, String debtName, String creditor, BigDecimal totalAmount,
                BigDecimal interestRate, LocalDate dueDate, String priority) {
        this.id = id;
        this.debtName = debtName;
        this.creditor = creditor;
        this.totalAmount = totalAmount;
        this.paidAmount = BigDecimal.ZERO;
        this.remainingAmount = totalAmount;
        this.interestRate = interestRate;
        this.dueDate = dueDate;
        this.status = "PENDING";
        this.priority = priority;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDebtName() {
        return debtName;
    }

    public void setDebtName(String debtName) {
        this.debtName = debtName;
    }

    public String getCreditor() {
        return creditor;
    }

    public void setCreditor(String creditor) {
        this.creditor = creditor;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(BigDecimal paidAmount) {
        this.paidAmount = paidAmount;
    }

    public BigDecimal getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(BigDecimal remainingAmount) {
        this.remainingAmount = remainingAmount;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}