package com.exp.tracker.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "budgets")
public class Budget {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String category;

	@Column(name = "budget_amount", nullable = false, precision = 19, scale = 2)
	private BigDecimal budgetAmount;

	@Column(name = "spent_amount", precision = 19, scale = 2)
	private BigDecimal spentAmount;

	@Column(name = "start_date", nullable = false)
	private LocalDate startDate;

	@Column(name = "end_date", nullable = false)
	private LocalDate endDate;

	@Column(name = "alert_threshold")
	private BigDecimal alertThreshold;

	public Budget() {
	}

	// Parameterized Constructor
	public Budget(Long id, String category, BigDecimal budgetAmount, BigDecimal spentAmount, LocalDate startDate,
			LocalDate endDate, BigDecimal alertThreshold) {
		this.id = id;
		this.category = category;
		this.budgetAmount = budgetAmount;
		this.spentAmount = spentAmount;
		this.startDate = startDate;
		this.endDate = endDate;
		this.alertThreshold = alertThreshold;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public BigDecimal getBudgetAmount() {
		return budgetAmount;
	}

	public void setBudgetAmount(BigDecimal budgetAmount) {
		this.budgetAmount = budgetAmount;
	}

	public BigDecimal getSpentAmount() {
		return spentAmount;
	}

	public void setSpentAmount(BigDecimal spentAmount) {
		this.spentAmount = spentAmount;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public BigDecimal getAlertThreshold() {
		return alertThreshold;
	}

	public void setAlertThreshold(BigDecimal alertThreshold) {
		this.alertThreshold = alertThreshold;
	}

	@Override
	public String toString() {
		return "Budget{" + "id=" + id + ", category='" + category + '\'' + ", budgetAmount=" + budgetAmount
				+ ", spentAmount=" + spentAmount + ", startDate=" + startDate + ", endDate=" + endDate
				+ ", alertThreshold=" + alertThreshold + '}';
	}
}