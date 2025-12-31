package com.exp.tracker.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.exp.tracker.entity.Budget;
import com.exp.tracker.repository.BudgetRepository;

@Service
public class BudgetService {
    
    private final BudgetRepository budgetRepository;
    
    @Autowired
    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }
    
    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }
    
    public Optional<Budget> getBudgetById(Long id) {
        return budgetRepository.findById(id);
    }
    
    public Budget createBudget(Budget budget) {
        return budgetRepository.save(budget);
    }
    
    public Budget updateBudget(Long id, Budget budgetDetails) {
        Budget budget = budgetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Budget not found with id: " + id));
        
        budget.setCategory(budgetDetails.getCategory());
        budget.setBudgetAmount(budgetDetails.getBudgetAmount());
        budget.setSpentAmount(budgetDetails.getSpentAmount());
        budget.setStartDate(budgetDetails.getStartDate());
        budget.setEndDate(budgetDetails.getEndDate());
        budget.setAlertThreshold(budgetDetails.getAlertThreshold());
        
        return budgetRepository.save(budget);
    }
    
    public void deleteBudget(Long id) {
        budgetRepository.deleteById(id);
    }
    
    public List<Budget> getActiveBudgets() {
        LocalDate today = LocalDate.now();
        return budgetRepository.findByEndDateAfter(today);
    }
    
    public List<Budget> getBudgetsByCategory(String category) {
        return budgetRepository.findByCategory(category);
    }
}