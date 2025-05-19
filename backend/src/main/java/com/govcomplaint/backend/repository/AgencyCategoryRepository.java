package com.govcomplaint.backend.repository;

import com.govcomplaint.backend.model.AgencyCategory;
import org.springframework.data.jpa.repository.JpaRepository;
 
public interface AgencyCategoryRepository extends JpaRepository<AgencyCategory, Long> {
} 