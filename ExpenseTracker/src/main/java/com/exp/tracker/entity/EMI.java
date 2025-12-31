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
@Table(name = "emi")
public class EMI {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "loan_name", nullable = false)
	private String loanName;

	@Column(name = "total_amount", precision = 19, scale = 2)
	private BigDecimal totalAmount;

	@Column(name = "emi_amount", precision = 19, scale = 2)
	private BigDecimal emiAmount;

	// Assuming tenure is in months
	@Column(name = "tenure")
	private Integer tenure;

	@Column(name = "interest_rate")
	private Double interestRate;

	@Column(name = "start_date")
	private LocalDate startDate;

	@Column(name = "next_due_date")
	private LocalDate nextDueDate;

	@Column(name = "paid_emis")
	private Integer paidEmis;

	@Column(name = "remaining_amount", precision = 19, scale = 2)
	private BigDecimal remainingAmount;

	@Column(name = "status")
	private String status;

	public EMI() {

	}

	public EMI(Long id, String loanName, BigDecimal totalAmount, BigDecimal emiAmount, Integer tenure,
			Double interestRate, LocalDate startDate, LocalDate nextDueDate, Integer paidEmis,
			BigDecimal remainingAmount, String status) {
		super();
		this.id = id;
		this.loanName = loanName;
		this.totalAmount = totalAmount;
		this.emiAmount = emiAmount;
		this.tenure = tenure;
		this.interestRate = interestRate;
		this.startDate = startDate;
		this.nextDueDate = nextDueDate;
		this.paidEmis = paidEmis;
		this.remainingAmount = remainingAmount;
		this.status = status;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getLoanName() {
		return loanName;
	}

	public void setLoanName(String loanName) {
		this.loanName = loanName;
	}

	public BigDecimal getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(BigDecimal totalAmount) {
		this.totalAmount = totalAmount;
	}

	public BigDecimal getEmiAmount() {
		return emiAmount;
	}

	public void setEmiAmount(BigDecimal emiAmount) {
		this.emiAmount = emiAmount;
	}

	public Integer getTenure() {
		return tenure;
	}

	public void setTenure(Integer tenure) {
		this.tenure = tenure;
	}

	public Double getInterestRate() {
		return interestRate;
	}

	public void setInterestRate(Double interestRate) {
		this.interestRate = interestRate;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getNextDueDate() {
		return nextDueDate;
	}

	public void setNextDueDate(LocalDate nextDueDate) {
		this.nextDueDate = nextDueDate;
	}

	public Integer getPaidEmis() {
		return paidEmis;
	}

	public void setPaidEmis(Integer paidEmis) {
		this.paidEmis = paidEmis;
	}

	public BigDecimal getRemainingAmount() {
		return remainingAmount;
	}

	public void setRemainingAmount(BigDecimal remainingAmount) {
		this.remainingAmount = remainingAmount;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}