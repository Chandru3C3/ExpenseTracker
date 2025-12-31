package com.exp.tracker.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.exp.tracker.entity.Expense;
import com.exp.tracker.repository.ExpenseRepository;

@Service
public class ExpenseService {
    
    private final ExpenseRepository expenseRepository;
    
    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }
    
    // Basic CRUD Operations
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }
    
    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }
    
    public Expense createExpense(Expense expense) {
        if (expense.getCreatedAt() == null) {
            expense.setCreatedAt(LocalDate.now());
        }
        return expenseRepository.save(expense);
    }
    
    public Expense updateExpense(Long id, Expense expenseDetails) {
        Expense expense = expenseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
        
        expense.setCategory(expenseDetails.getCategory());
        expense.setDescription(expenseDetails.getDescription());
        expense.setAmount(expenseDetails.getAmount());
        expense.setExpenseDate(expenseDetails.getExpenseDate());
        expense.setPaymentMethod(expenseDetails.getPaymentMethod());
        
        return expenseRepository.save(expense);
    }
    
    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new RuntimeException("Expense not found with id: " + id);
        }
        expenseRepository.deleteById(id);
    }
    
    // Query Operations
    public List<Expense> getExpensesByCategory(String category) {
        return expenseRepository.findByCategory(category);
    }
    
    public List<Expense> getExpensesByDateRange(LocalDate startDate, LocalDate endDate) {
        return expenseRepository.findExpensesByDateRange(startDate, endDate);
    }
    
    // Analytics Operations
    public BigDecimal getTotalExpensesByDateRange(LocalDate startDate, LocalDate endDate) {
        List<Expense> expenses = expenseRepository.findExpensesByDateRange(startDate, endDate);
        return expenses.stream()
            .map(Expense::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    public Map<String, BigDecimal> getExpensesByCategory() {
        List<Expense> expenses = expenseRepository.findAll();
        return expenses.stream()
            .collect(Collectors.groupingBy(
                Expense::getCategory,
                Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
            ));
    }
    
    public BigDecimal getCurrentMonthExpenses() {
        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(today);
        LocalDate startOfMonth = currentMonth.atDay(1);
        LocalDate endOfMonth = currentMonth.atEndOfMonth();
        
        return getTotalExpensesByDateRange(startOfMonth, endOfMonth);
    }
    
    public List<Expense> getCurrentMonthExpensesList() {
        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(today);
        LocalDate startOfMonth = currentMonth.atDay(1);
        LocalDate endOfMonth = currentMonth.atEndOfMonth();
        
        return expenseRepository.findExpensesByDateRange(startOfMonth, endOfMonth);
    }
    
    public BigDecimal getAverageExpense() {
        List<Expense> expenses = expenseRepository.findAll();
        if (expenses.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal total = expenses.stream()
            .map(Expense::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return total.divide(
            BigDecimal.valueOf(expenses.size()), 
            2, 
            BigDecimal.ROUND_HALF_UP
        );
    }
}