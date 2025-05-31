package com.govcomplaint.backend.service;

import com.govcomplaint.backend.dto.ComplaintRequest;
import com.govcomplaint.backend.dto.ComplaintResponse;
import com.govcomplaint.backend.model.*;
import com.govcomplaint.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ComplaintService {
    @Autowired
    private ComplaintRepository complaintRepository;
    @Autowired
    private AgencyRepository agencyRepository;
    @Autowired
    private CitizenRepository citizenRepository;

    public ComplaintResponse createComplaint(ComplaintRequest request) {
        Agency agency = agencyRepository.findById(request.getAgencyId())
                .orElseThrow(() -> new IllegalArgumentException("Agency not found"));
        Citizen citizen = citizenRepository.findById(request.getCitizenId())
                .orElseThrow(() -> new IllegalArgumentException("Citizen not found"));
        Complaints complaint = new Complaints();
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setAgency(agency);
        complaint.setCitizen(citizen);
        complaint.setCategory(request.getCategory());
        complaint.setComplaintStatus(ComplaintStatus.PENDING);
        Complaints saved = complaintRepository.save(complaint);
        return toResponse(saved);
    }

    public List<ComplaintResponse> getCitizenComplaints(UUID citizenId) {
        Citizen citizen = citizenRepository.findById(citizenId)
                .orElseThrow(() -> new IllegalArgumentException("Citizen not found"));
        return complaintRepository.findByCitizen(citizen).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ComplaintResponse> getAgencyComplaints(UUID agencyId, String category, String status) {
        Agency agency = agencyRepository.findById(agencyId)
                .orElseThrow(() -> new IllegalArgumentException("Agency not found"));
        if (category != null && status != null) {
            return complaintRepository.findByAgencyAndCategoryAndComplaintStatus(
                    agency, category, ComplaintStatus.valueOf(status.toUpperCase()))
                    .stream().map(this::toResponse).collect(Collectors.toList());
        } else if (category != null) {
            return complaintRepository.findByAgencyAndCategory(agency, category)
                    .stream().map(this::toResponse).collect(Collectors.toList());
        } else if (status != null) {
            return complaintRepository.findByAgencyAndComplaintStatus(
                    agency, ComplaintStatus.valueOf(status.toUpperCase()))
                    .stream().map(this::toResponse).collect(Collectors.toList());
        } else {
            return complaintRepository.findByAgency(agency)
                    .stream().map(this::toResponse).collect(Collectors.toList());
        }
    }

    public Optional<ComplaintResponse> getComplaint(Long id) {
        return complaintRepository.findById(id).map(this::toResponse);
    }

    public ComplaintResponse updateComplaintStatus(Long complaintId, UUID agencyId, String status, String response) {
        Complaints complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found"));
        if (!complaint.getAgency().getId().equals(agencyId)) {
            throw new IllegalArgumentException("Agency not authorized to update this complaint");
        }
        complaint.setComplaintStatus(ComplaintStatus.valueOf(status.toUpperCase()));
        complaint.setResponse(response);
        Complaints saved = complaintRepository.save(complaint);
        return toResponse(saved);
    }

    private ComplaintResponse toResponse(Complaints c) {
        ComplaintResponse dto = new ComplaintResponse();
        dto.setId(c.getId());
        dto.setTitle(c.getTitle());
        dto.setDescription(c.getDescription());
        dto.setCategory(c.getCategory());
        dto.setComplaintStatus(c.getComplaintStatus());
        dto.setResponse(c.getResponse());
        dto.setAgencyName(c.getAgency() != null ? c.getAgency().getAgencyName() : null);
        dto.setAgencyId(c.getAgency() != null ? c.getAgency().getId() : null);
        dto.setCitizenName(c.getCitizen() != null ? c.getCitizen().getFullName() : null);
        dto.setCitizenId(c.getCitizen() != null ? c.getCitizen().getId() : null);
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        return dto;
    }
}
