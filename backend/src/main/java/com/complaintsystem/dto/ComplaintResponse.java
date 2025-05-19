package com.complaintsystem.dto;

import com.complaintsystem.model.ComplaintStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ComplaintResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private ComplaintStatus status;
    private String response;
    private UserResponse citizen;
    private UserResponse agency;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 