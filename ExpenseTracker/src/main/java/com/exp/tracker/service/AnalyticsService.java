package com.exp.tracker.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.exp.tracker.entity.Debt;
import com.exp.tracker.entity.EMI;
import com.exp.tracker.entity.Expense;
import com.exp.tracker.repository.BudgetRepository;
import com.exp.tracker.repository.DebtRepository;
import com.exp.tracker.repository.EMIRepository;
import com.exp.tracker.repository.ExpenseRepository;

@Service
public class AnalyticsService {
    
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final DebtRepository debtRepository;
    private final EMIRepository emiRepository;
    
    @Autowired
    public AnalyticsService(ExpenseRepository expenseRepository,
                           BudgetRepository budgetRepository,
                           DebtRepository debtRepository,
                           EMIRepository emiRepository) {
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
        this.debtRepository = debtRepository;
        this.emiRepository = emiRepository;
    }
    
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = YearMonth.from(today).atDay(1);
        LocalDate endOfMonth = YearMonth.from(today).atEndOfMonth();
        
        List<Expense> monthExpenses = expenseRepository
            .findExpensesByDateRange(startOfMonth, endOfMonth);
        
        BigDecimal totalExpenses = monthExpenses.stream()
            .map(Expense::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        List<EMI> activeEmis = emiRepository.findByStatus("ACTIVE");
        BigDecimal totalEmiAmount = activeEmis.stream()
            .map(EMI::getEmiAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        List<Debt> allDebts = debtRepository.findAll();
        BigDecimal totalDebts = allDebts.stream()
            .map(debt -> debt.getRemainingAmount() != null ? 
                debt.getRemainingAmount() : debt.getTotalAmount())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        stats.put("totalExpenses", totalExpenses);
        stats.put("activeEMIs", activeEmis.size());
        stats.put("totalEMIAmount", totalEmiAmount);
        stats.put("totalDebts", totalDebts);
        stats.put("pendingDebts", debtRepository.findByStatus("PENDING").size());
        
        return stats;
    }
    
    public List<Map<String, Object>> getCategoryExpenses() {
        List<Expense> expenses = expenseRepository.findAll();
        
        Map<String, BigDecimal> categoryTotals = expenses.stream()
            .collect(Collectors.groupingBy(
                Expense::getCategory,
                Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
            ));
        
        return categoryTotals.entrySet().stream()
            .map(entry -> {
                Map<String, Object> map = new HashMap<>();
                map.put("category", entry.getKey());
                map.put("amount", entry.getValue());
                return map;
            })
            .collect(Collectors.toList());
    }
    
    public List<Map<String, Object>> getMonthlyTrends() {
        List<Map<String, Object>> trends = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        for (int i = 5; i >= 0; i--) {
            YearMonth yearMonth = YearMonth.from(today.minusMonths(i));
            LocalDate start = yearMonth.atDay(1);
            LocalDate end = yearMonth.atEndOfMonth();
            
            List<Expense> monthExpenses = expenseRepository
                .findExpensesByDateRange(start, end);
            
            BigDecimal total = monthExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            Map<String, Object> trend = new HashMap<>();
            trend.put("month", yearMonth.toString());
            trend.put("expenses", total);
            trends.add(trend);
        }
        
        return trends;
    }
    
    public Map<String, Object> getFinancialSummary(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> summary = new HashMap<>();
        
        List<Expense> expenses = expenseRepository
            .findExpensesByDateRange(startDate, endDate);
        
        BigDecimal totalExpenses = expenses.stream()
            .map(Expense::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Map<String, BigDecimal> categoryBreakdown = expenses.stream()
            .collect(Collectors.groupingBy(
                Expense::getCategory,
                Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
            ));
        
        summary.put("totalExpenses", totalExpenses);
        summary.put("categoryBreakdown", categoryBreakdown);
        summary.put("transactionCount", expenses.size());
        summary.put("averageExpense", 
            expenses.isEmpty() ? BigDecimal.ZERO : 
            totalExpenses.divide(BigDecimal.valueOf(expenses.size()), 2, BigDecimal.ROUND_HALF_UP));
        
        return summary;
    }
}