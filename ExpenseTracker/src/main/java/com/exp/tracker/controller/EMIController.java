package com.exp.tracker.controller;

import java.util.List;

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

import com.exp.tracker.entity.EMI;
import com.exp.tracker.service.EMIService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/emis")
@CrossOrigin(origins = "http://localhost:4200")
public class EMIController {
    
    private final EMIService emiService;
    
    @Autowired
    public EMIController(EMIService emiService) {
        this.emiService = emiService;
    }
    
    @GetMapping
    public ResponseEntity<List<EMI>> getAllEMIs() {
        List<EMI> emis = emiService.getAllEMIs();
        return ResponseEntity.ok(emis);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<EMI> getEMIById(@PathVariable Long id) {
        return emiService.getEMIById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<EMI> createEMI(@Valid @RequestBody EMI emi) {
        EMI createdEMI = emiService.createEMI(emi);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEMI);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<EMI> updateEMI(@PathVariable Long id, @Valid @RequestBody EMI emi) {
        try {
            EMI updatedEMI = emiService.updateEMI(id, emi);
            return ResponseEntity.ok(updatedEMI);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEMI(@PathVariable Long id) {
        emiService.deleteEMI(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{id}/pay")
    public ResponseEntity<EMI> payEMI(@PathVariable Long id) {
        try {
            EMI paidEMI = emiService.payEMI(id);
            return ResponseEntity.ok(paidEMI);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<EMI>> getActiveEMIs() {
        List<EMI> emis = emiService.getActiveEMIs();
        return ResponseEntity.ok(emis);
    }
}