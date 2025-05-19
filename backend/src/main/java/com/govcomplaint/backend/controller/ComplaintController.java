package com.govcomplaint.backend.controller;

import com.govcomplaint.backend.dto.ComplaintRequest;
import com.govcomplaint.backend.dto.ComplaintResponse;
import com.govcomplaint.backend.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ComplaintResponse> createComplaint(@RequestBody ComplaintRequest request) {
        ComplaintResponse savedComplaint = complaintService.createComplaint(request);
        return ResponseEntity.ok(savedComplaint);
    }

    @GetMapping("/citizen/{citizenId}")
    public ResponseEntity<List<ComplaintResponse>> getCitizenComplaints(@PathVariable UUID citizenId) {
        return ResponseEntity.ok(complaintService.getCitizenComplaints(citizenId));
    }

    @GetMapping("/agency/{agencyId}")
    public ResponseEntity<List<ComplaintResponse>> getAgencyComplaints(
            @PathVariable UUID agencyId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(complaintService.getAgencyComplaints(agencyId, category, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponse> getComplaint(@PathVariable Long id) {
        Optional<ComplaintResponse> complaint = complaintService.getComplaint(id);
        return complaint.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ComplaintResponse> updateComplaintStatus(
            @PathVariable Long id,
            @RequestParam UUID agencyId,
            @RequestParam String status,
            @RequestParam(required = false) String response) {
        ComplaintResponse updated = complaintService.updateComplaintStatus(id, agencyId, status, response);
        return ResponseEntity.ok(updated);
    }
}