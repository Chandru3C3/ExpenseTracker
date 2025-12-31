package com.exp.tracker.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.exp.tracker.entity.Debt;
import com.exp.tracker.service.DebtService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/debts")
@CrossOrigin(origins = "http://localhost:4200")
public class DebtController {
    
    private final DebtService debtService;
    
    @Autowired
    public DebtController(DebtService debtService) {
        this.debtService = debtService;
    }
    
    @GetMapping
    public ResponseEntity<List<Debt>> getAllDebts() {
        List<Debt> debts = debtService.getAllDebts();
        return ResponseEntity.ok(debts);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Debt> getDebtById(@PathVariable Long id) {
        return debtService.getDebtById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Debt> createDebt(@Valid @RequestBody Debt debt) {
        Debt createdDebt = debtService.createDebt(debt);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDebt);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Debt> updateDebt(@PathVariable Long id, 
                                           @Valid @RequestBody Debt debt) {
        try {
            Debt updatedDebt = debtService.updateDebt(id, debt);
            return ResponseEntity.ok(updatedDebt);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDebt(@PathVariable Long id) {
        debtService.deleteDebt(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{id}/payment")
    public ResponseEntity<Debt> makePayment(@PathVariable Long id, 
                                            @RequestBody Map<String, BigDecimal> payment) {
        try {
            BigDecimal amount = payment.get("amount");
            Debt updatedDebt = debtService.makePayment(id, amount);
            return ResponseEntity.ok(updatedDebt);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<Debt>> getPendingDebts() {
        List<Debt> debts = debtService.getPendingDebts();
        return ResponseEntity.ok(debts);
    }
    
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Debt>> getDebtsByPriority(@PathVariable String priority) {
        List<Debt> debts = debtService.getDebtsByPriority(priority);
        return ResponseEntity.ok(debts);
    }
}