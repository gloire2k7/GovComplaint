package com.govcomplaint.backend.repository;

import com.govcomplaint.backend.dto.ComplaintRequest;
import com.govcomplaint.backend.model.Complaints;
import com.govcomplaint.backend.model.ComplaintStatus;
import com.govcomplaint.backend.model.Agency;
import com.govcomplaint.backend.model.Citizen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaints, Long> {
    List<Complaints> findByCitizen(Citizen citizen);
    List<Complaints> findByAgency(Agency agency);
    List<Complaints> findByAgencyAndComplaintStatus(Agency agency, ComplaintStatus status);
    List<Complaints> findByAgencyAndCategory(Agency agency, String category);
    List<Complaints> findByAgencyAndCategoryAndComplaintStatus(Agency agency, String category, ComplaintStatus status);
}
