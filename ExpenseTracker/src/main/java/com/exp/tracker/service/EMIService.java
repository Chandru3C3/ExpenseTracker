package com.exp.tracker.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.exp.tracker.entity.EMI;
import com.exp.tracker.repository.EMIRepository;

@Service
public class EMIService {

	private final EMIRepository emiRepository;

	@Autowired
	public EMIService(EMIRepository emiRepository) {
		this.emiRepository = emiRepository;
	}

	// Basic CRUD Operations
	public List<EMI> getAllEMIs() {
		return emiRepository.findAll();
	}

	public Optional<EMI> getEMIById(Long id) {
		return emiRepository.findById(id);
	}

	public EMI createEMI(EMI emi) {
		// Initialize default values
		if (emi.getNextDueDate() == null) {
			emi.setNextDueDate(emi.getStartDate());
		}
		if (emi.getRemainingAmount() == null) {
			emi.setRemainingAmount(emi.getTotalAmount());
		}
		if (emi.getPaidEmis() == null) {
			emi.setPaidEmis(0);
		}
		if (emi.getStatus() == null) {
			emi.setStatus("ACTIVE");
		}

		return emiRepository.save(emi);
	}

	public EMI updateEMI(Long id, EMI emiDetails) {
		EMI emi = emiRepository.findById(id).orElseThrow(() -> new RuntimeException("EMI not found with id: " + id));

		emi.setLoanName(emiDetails.getLoanName());
		emi.setTotalAmount(emiDetails.getTotalAmount());
		emi.setEmiAmount(emiDetails.getEmiAmount());
		emi.setTenure(emiDetails.getTenure());
		emi.setInterestRate(emiDetails.getInterestRate());
		emi.setStartDate(emiDetails.getStartDate());

		// Recalculate remaining amount if total amount changed
		if (emi.getPaidEmis() != null && emi.getEmiAmount() != null) {
			BigDecimal paidAmount = emi.getEmiAmount().multiply(BigDecimal.valueOf(emi.getPaidEmis()));
			BigDecimal remaining = emi.getTotalAmount().subtract(paidAmount);
			emi.setRemainingAmount(remaining.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : remaining);
		}

		return emiRepository.save(emi);
	}

	public void deleteEMI(Long id) {
		if (!emiRepository.existsById(id)) {
			throw new RuntimeException("EMI not found with id: " + id);
		}
		emiRepository.deleteById(id);
	}

	// Payment Operations
	public EMI payEMI(Long id) {
		EMI emi = emiRepository.findById(id).orElseThrow(() -> new RuntimeException("EMI not found with id: " + id));

		if ("COMPLETED".equals(emi.getStatus())) {
			throw new RuntimeException("EMI already completed");
		}

		// Increment paid EMIs
		Integer paidEmis = emi.getPaidEmis() + 1;
		emi.setPaidEmis(paidEmis);

		// Calculate remaining amount
		BigDecimal remaining = emi.getRemainingAmount().subtract(emi.getEmiAmount());
		emi.setRemainingAmount(remaining.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : remaining);

		// Update next due date
		emi.setNextDueDate(emi.getNextDueDate().plusMonths(1));

		// Update status if completed
		if (paidEmis >= emi.getTenure() || emi.getRemainingAmount().compareTo(BigDecimal.ZERO) == 0) {
			emi.setStatus("COMPLETED");
		}

		return emiRepository.save(emi);
	}

	// Query Operations
	public List<EMI> getActiveEMIs() {
		return emiRepository.findByStatus("ACTIVE");
	}

	public List<EMI> getCompletedEMIs() {
		return emiRepository.findByStatus("COMPLETED");
	}

	// Analytics Operations
	public BigDecimal getTotalActiveEMIAmount() {
		List<EMI> activeEmis = emiRepository.findByStatus("ACTIVE");
		return activeEmis.stream().map(EMI::getEmiAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
	}

	public BigDecimal getTotalRemainingAmount() {
		List<EMI> activeEmis = emiRepository.findByStatus("ACTIVE");
		return activeEmis.stream()
				.map(emi -> emi.getRemainingAmount() != null ? emi.getRemainingAmount() : emi.getTotalAmount())
				.reduce(BigDecimal.ZERO, BigDecimal::add);
	}

	public List<EMI> getUpcomingEMIs() {
		LocalDate today = LocalDate.now();
		LocalDate nextWeek = today.plusDays(7);

		return emiRepository.findByStatus("ACTIVE").stream().filter(emi -> {
			LocalDate dueDate = emi.getNextDueDate();
			return dueDate != null && !dueDate.isBefore(today) && !dueDate.isAfter(nextWeek);
		}).toList();
	}

	public List<EMI> getOverdueEMIs() {
		LocalDate today = LocalDate.now();

		return emiRepository.findByStatus("ACTIVE").stream().filter(emi -> {
			LocalDate dueDate = emi.getNextDueDate();
			return dueDate != null && dueDate.isBefore(today);
		}).toList();
	}

	// Utility method to calculate EMI amount
	public BigDecimal calculateEMI(BigDecimal principal, Double ratePerYear, Integer tenureMonths) {
		if (ratePerYear == 0) {
			return principal.divide(BigDecimal.valueOf(tenureMonths), 2, BigDecimal.ROUND_HALF_UP);
		}

		double ratePerMonth = ratePerYear / (12 * 100);
		double emi = (principal.doubleValue() * ratePerMonth * Math.pow(1 + ratePerMonth, tenureMonths))
				/ (Math.pow(1 + ratePerMonth, tenureMonths) - 1);

		return BigDecimal.valueOf(emi).setScale(2, BigDecimal.ROUND_HALF_UP);
	}
}