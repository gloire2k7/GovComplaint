package com.govcomplaint.backend.controller;

import com.govcomplaint.backend.dto.ComplaintRequest;
import com.govcomplaint.backend.model.Complaints;
import com.govcomplaint.backend.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<Complaints> createComplaint(@RequestBody ComplaintRequest request) {
        Complaints savedComplaint = complaintService.createComplaint(request);
        return ResponseEntity.ok(savedComplaint);
    }
}