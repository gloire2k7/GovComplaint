package com.govcomplaint.backend.dto;

import com.govcomplaint.backend.model.UserType;
import lombok.Data;
import java.util.Set;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String displayName;
    private UserType userType;
    private String agencyName;
    private Set<String> categories;
} 