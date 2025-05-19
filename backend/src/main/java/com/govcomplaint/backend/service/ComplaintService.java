package com.govcomplaint.backend.service;

import com.govcomplaint.backend.dto.ComplaintRequest;
import com.govcomplaint.backend.model.Complaints;
import com.govcomplaint.backend.model.User;
import com.govcomplaint.backend.repository.ComplaintRepository;
import com.govcomplaint.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ComplaintService {

    @Autowired
    ComplaintRepository complaintRepository;

    @Autowired
    UserRepository userRepository;

    @Transactional
    public Complaints createComplaint(ComplaintRequest request) {
        Complaints complaint = new Complaints();
        complaint.setTitle(request.getTitle());
        complaint.setAgencyName(request.getAgencyName());
        complaint.setCategory(request.getCategory());
        complaint.setDescription(request.getDescription());

            return complaintRepository.save(complaint);
    }


}
