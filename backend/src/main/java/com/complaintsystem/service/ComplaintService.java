package com.complaintsystem.service;

import com.complaintsystem.dto.ComplaintRequest;
import com.complaintsystem.dto.ComplaintResponse;
import com.complaintsystem.dto.UserResponse;
import com.complaintsystem.exception.ResourceNotFoundException;
import com.complaintsystem.model.Complaint;
import com.complaintsystem.model.ComplaintStatus;
import com.complaintsystem.model.User;
import com.complaintsystem.repository.ComplaintRepository;
import com.complaintsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ComplaintService {
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    @Transactional
    public ComplaintResponse createComplaint(ComplaintRequest request, Long citizenId) {
        User citizen = userRepository.findById(citizenId)
            .orElseThrow(() -> new ResourceNotFoundException("Citizen not found"));
        
        User agency = userRepository.findById(request.getAgencyId())
            .orElseThrow(() -> new ResourceNotFoundException("Agency not found"));
        
        // Validate that the user is an agency
        if (!"AGENCY".equals(agency.getUserType())) {
            throw new IllegalArgumentException("The specified ID does not belong to an agency");
        }
        
        // Validate that the category is allowed for this agency
        if (!agency.getCategories().contains(request.getCategory())) {
            throw new IllegalArgumentException("Invalid category for this agency");
        }

        Complaint complaint = new Complaint();
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCategory(request.getCategory());
        complaint.setCitizen(citizen);
        complaint.setAgency(agency);
        complaint.setStatus(ComplaintStatus.PENDING);

        return mapToResponse(complaintRepository.save(complaint));
    }

    public Page<ComplaintResponse> getCitizenComplaints(Long citizenId, Pageable pageable) {
        return complaintRepository.findByCitizenId(citizenId, pageable)
            .map(this::mapToResponse);
    }

    public Page<ComplaintResponse> getAgencyComplaints(Long agencyId, Pageable pageable) {
        return complaintRepository.findByAgencyId(agencyId, pageable)
            .map(this::mapToResponse);
    }

    public Page<ComplaintResponse> getAgencyComplaintsByCategory(
        Long agencyId, String category, Pageable pageable) {
        return complaintRepository.findByAgencyIdAndCategory(agencyId, category, pageable)
            .map(this::mapToResponse);
    }

    public Page<ComplaintResponse> getAgencyComplaintsByStatus(
        Long agencyId, ComplaintStatus status, Pageable pageable) {
        return complaintRepository.findByAgencyIdAndStatus(agencyId, status, pageable)
            .map(this::mapToResponse);
    }

    public Page<ComplaintResponse> getAgencyComplaintsByCategoryAndStatus(
        Long agencyId, String category, ComplaintStatus status, Pageable pageable) {
        return complaintRepository.findByAgencyIdAndCategoryAndStatus(agencyId, category, status, pageable)
            .map(this::mapToResponse);
    }

    @Transactional
    public ComplaintResponse updateComplaintStatus(
        Long complaintId, Long agencyId, ComplaintStatus status, String response) {
        Complaint complaint = complaintRepository.findById(complaintId)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        if (!complaint.getAgency().getId().equals(agencyId)) {
            throw new IllegalArgumentException("Agency not authorized to update this complaint");
        }

        complaint.setStatus(status);
        if (response != null) {
            complaint.setResponse(response);
        }

        return mapToResponse(complaintRepository.save(complaint));
    }

    private ComplaintResponse mapToResponse(Complaint complaint) {
        ComplaintResponse response = new ComplaintResponse();
        response.setId(complaint.getId());
        response.setTitle(complaint.getTitle());
        response.setDescription(complaint.getDescription());
        response.setCategory(complaint.getCategory());
        response.setStatus(complaint.getStatus());
        response.setResponse(complaint.getResponse());
        response.setCreatedAt(complaint.getCreatedAt());
        response.setUpdatedAt(complaint.getUpdatedAt());
        
        // Map citizen
        UserResponse citizenResponse = new UserResponse();
        citizenResponse.setId(complaint.getCitizen().getId());
        citizenResponse.setEmail(complaint.getCitizen().getEmail());
        citizenResponse.setDisplayName(complaint.getCitizen().getDisplayName());
        response.setCitizen(citizenResponse);
        
        // Map agency
        UserResponse agencyResponse = new UserResponse();
        agencyResponse.setId(complaint.getAgency().getId());
        agencyResponse.setEmail(complaint.getAgency().getEmail());
        agencyResponse.setDisplayName(complaint.getAgency().getDisplayName());
        response.setAgency(agencyResponse);
        
        return response;
    }
} 