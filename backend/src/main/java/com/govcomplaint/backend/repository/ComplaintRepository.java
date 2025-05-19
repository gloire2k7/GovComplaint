package com.govcomplaint.backend.repository;

import com.govcomplaint.backend.dto.ComplaintRequest;
import com.govcomplaint.backend.model.Complaints;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaints,Long> {


}
