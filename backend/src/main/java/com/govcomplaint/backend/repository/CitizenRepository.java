package com.govcomplaint.backend.repository;

import com.govcomplaint.backend.model.Citizen;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface CitizenRepository extends JpaRepository<Citizen, UUID> {
    Optional<Citizen> findByEmail(String email);
    boolean existsByEmail(String email);
} 