package com.govcomplaint.backend.controller;

import com.govcomplaint.backend.service.AuthService;
import com.govcomplaint.backend.repository.CitizenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173"}, allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private CitizenRepository citizenRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {
        String userType = (String) body.get("userType");
        if (userType == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "userType is required"));
        }
        if (userType.equals("CITIZEN")) {
            String email = (String) body.get("email");
            String password = (String) body.get("password");
            String displayName = (String) body.get("displayName");
            if (email == null || password == null || displayName == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Missing required fields for citizen"));
            }
            return ResponseEntity.ok(authService.registerCitizen(email, password, displayName));
        } else if (userType.equals("AGENCY")) {
            try {
                String email = (String) body.get("email");
                String password = (String) body.get("password");
                String agencyName = (String) body.get("agencyName");
                Set<String> categories = Set.of();
                if (body.get("categories") != null) {
                    categories = ((java.util.List<?>) body.get("categories"))
                        .stream()
                        .map(Object::toString)
                        .collect(Collectors.toSet());
                }
                if (email == null || password == null || agencyName == null) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Missing required fields for agency"));
                }
                return ResponseEntity.ok(authService.registerAgency(email, password, agencyName, categories));
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(Map.of("message", e.getMessage(), "exception", e.getClass().getName()));
            }
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid userType"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> body) {
        String email = (String) body.get("email");
        String password = (String) body.get("password");
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }
        return ResponseEntity.ok(authService.login(email, password));
    }

    @GetMapping("/citizens/{id}")
    public ResponseEntity<?> getCitizenById(@PathVariable("id") java.util.UUID id) {
        return citizenRepository.findById(id)
            .map(citizen -> ResponseEntity.ok(Map.of(
                "id", citizen.getId(),
                "fullName", citizen.getFullName(),
                "email", citizen.getEmail(),
                "userType", citizen.getUserType()
            )))
            .orElse(ResponseEntity.notFound().build());
    }
} 