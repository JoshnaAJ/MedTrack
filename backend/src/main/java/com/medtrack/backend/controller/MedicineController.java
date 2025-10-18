package com.medtrack.backend.controller;

import com.medtrack.backend.model.Medicine;
import com.medtrack.backend.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    @Autowired
    private MedicineRepository medicineRepository;

    @GetMapping
    public ResponseEntity<?> list(HttpServletRequest req) {
        Object o = req.getAttribute("authEmail");
        if (o == null) return ResponseEntity.status(401).body("unauthenticated");
        String email = o.toString();
        List<Medicine> items = medicineRepository.findByOwnerEmailOrderByIdDesc(email);
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<?> create(HttpServletRequest req, @RequestBody Medicine m) {
        Object o = req.getAttribute("authEmail");
        if (o == null) return ResponseEntity.status(401).body("unauthenticated");
        String email = o.toString();
        Medicine item = new Medicine(email, m.getName(), m.getDosage(), m.getTime());
        item.setExpiryDate(m.getExpiryDate());
        medicineRepository.save(item);
        return ResponseEntity.ok(item);
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggle(HttpServletRequest req, @PathVariable Long id) {
        Object o = req.getAttribute("authEmail");
        if (o == null) return ResponseEntity.status(401).body("unauthenticated");
        String email = o.toString();
        return medicineRepository.findById(id).map(it -> {
            if (!email.equals(it.getOwnerEmail())) return ResponseEntity.status(403).body("forbidden");
            it.setTaken(!it.isTaken());
            medicineRepository.save(it);
            return ResponseEntity.ok(it);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
