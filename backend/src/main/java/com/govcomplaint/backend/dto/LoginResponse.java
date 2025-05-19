package com.govcomplaint.backend.dto;

import com.govcomplaint.backend.model.UserType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String id;
    private String email;
    private String displayName;
    private UserType userType;
    private String agencyName;
    private Set<String> categories;
} 