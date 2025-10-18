package com.medtrack.backend.repository;

import com.medtrack.backend.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByOwnerEmailOrderByIdDesc(String ownerEmail);
}
