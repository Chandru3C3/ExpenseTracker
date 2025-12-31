package com.exp.tracker.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.exp.tracker.entity.Debt;
import com.exp.tracker.repository.DebtRepository;

@Service
public class DebtService {
    
    private final DebtRepository debtRepository;
    
    @Autowired
    public DebtService(DebtRepository debtRepository) {
        this.debtRepository = debtRepository;
    }
    
    public List<Debt> getAllDebts() {
        return debtRepository.findAll();
    }
    
    public Optional<Debt> getDebtById(Long id) {
        return debtRepository.findById(id);
    }
    
    public Debt createDebt(Debt debt) {
        debt.setRemainingAmount(debt.getTotalAmount());
        debt.setPaidAmount(BigDecimal.ZERO);
        debt.setStatus("PENDING");
        return debtRepository.save(debt);
    }
    
    public Debt updateDebt(Long id, Debt debtDetails) {
        Debt debt = debtRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Debt not found with id: " + id));
        
        debt.setDebtName(debtDetails.getDebtName());
        debt.setCreditor(debtDetails.getCreditor());
        debt.setTotalAmount(debtDetails.getTotalAmount());
        debt.setInterestRate(debtDetails.getInterestRate());
        debt.setDueDate(debtDetails.getDueDate());
        debt.setPriority(debtDetails.getPriority());
        
        return debtRepository.save(debt);
    }
    
    public void deleteDebt(Long id) {
        debtRepository.deleteById(id);
    }
    
    public Debt makePayment(Long id, BigDecimal paymentAmount) {
        Debt debt = debtRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Debt not found with id: " + id));
        
        BigDecimal currentPaid = debt.getPaidAmount();
        BigDecimal newPaidAmount = currentPaid.add(paymentAmount);
        debt.setPaidAmount(newPaidAmount);
        
        BigDecimal remaining = debt.getTotalAmount().subtract(newPaidAmount);
        debt.setRemainingAmount(remaining.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : remaining);
        
        if (debt.getRemainingAmount().compareTo(BigDecimal.ZERO) == 0) {
            debt.setStatus("PAID");
        } else if (newPaidAmount.compareTo(BigDecimal.ZERO) > 0) {
            debt.setStatus("PARTIAL");
        }
        
        return debtRepository.save(debt);
    }
    
    public List<Debt> getPendingDebts() {
        return debtRepository.findByStatus("PENDING");
    }
    
    public List<Debt> getDebtsByPriority(String priority) {
        return debtRepository.findByPriority(priority);
    }
}