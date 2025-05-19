package com.complaintsystem.repository;

import com.complaintsystem.model.Complaint;
import com.complaintsystem.model.ComplaintStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Page<Complaint> findByCitizenId(Long citizenId, Pageable pageable);
    
    Page<Complaint> findByAgencyId(Long agencyId, Pageable pageable);
    
    @Query("SELECT c FROM Complaint c WHERE c.agencyId = :agencyId AND c.category = :category")
    Page<Complaint> findByAgencyIdAndCategory(
        @Param("agencyId") Long agencyId,
        @Param("category") String category,
        Pageable pageable
    );
    
    @Query("SELECT c FROM Complaint c WHERE c.agencyId = :agencyId AND c.status = :status")
    Page<Complaint> findByAgencyIdAndStatus(
        @Param("agencyId") Long agencyId,
        @Param("status") ComplaintStatus status,
        Pageable pageable
    );
    
    @Query("SELECT c FROM Complaint c WHERE c.agencyId = :agencyId AND c.category = :category AND c.status = :status")
    Page<Complaint> findByAgencyIdAndCategoryAndStatus(
        @Param("agencyId") Long agencyId,
        @Param("category") String category,
        @Param("status") ComplaintStatus status,
        Pageable pageable
    );
} 