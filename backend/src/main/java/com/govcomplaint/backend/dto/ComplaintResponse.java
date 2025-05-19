package com.govcomplaint.backend.dto;

import com.govcomplaint.backend.model.ComplaintStatus;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ComplaintResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private ComplaintStatus complaintStatus;
    private String response;
    private String agencyName;
    private UUID agencyId;
    private String citizenName;
    private UUID citizenId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 