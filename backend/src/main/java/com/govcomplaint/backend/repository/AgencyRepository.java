package com.govcomplaint.backend.repository;

import com.govcomplaint.backend.model.Agency;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface AgencyRepository extends JpaRepository<Agency, UUID> {
    Optional<Agency> findByEmail(String email);
    boolean existsByEmail(String email);
} 