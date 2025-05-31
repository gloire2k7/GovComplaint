package com.govcomplaint.backend.controller;

import com.govcomplaint.backend.model.Agency;
import com.govcomplaint.backend.model.AgencyCategory;
import com.govcomplaint.backend.repository.AgencyRepository;
import com.govcomplaint.backend.repository.AgencyCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.UUID;

@RestController
@RequestMapping("/api/agencies")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173"}, allowCredentials = "true")
public class AgencyController {

    @Autowired
    private AgencyRepository agencyRepository;

    @Autowired
    private AgencyCategoryRepository agencyCategoryRepository;

    @GetMapping
    public ResponseEntity<?> getAllAgencies() {
        try {
            List<Agency> agencies = agencyRepository.findAll();
            List<Map<String, Object>> agencyDtos = agencies.stream()
                .map(agency -> Map.of(
                    "id", agency.getId(),
                    "name", agency.getAgencyName(),
                    "categories", agency.getCategories() == null ? List.of() :
                        agency.getCategories().stream()
                            .map(cat -> cat != null ? cat.getCategoryName() : null)
                            .filter(catName -> catName != null)
                            .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
            return ResponseEntity.ok(agencyDtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", "Failed to fetch agencies",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/{id}/categories")
    public ResponseEntity<List<String>> getCategoriesForAgency(@PathVariable("id") UUID agencyId) {
        List<AgencyCategory> categories = agencyCategoryRepository.findAll()
            .stream()
            .filter(cat -> cat.getAgency().getId().equals(agencyId))
            .collect(Collectors.toList());
        List<String> categoryNames = categories.stream()
            .map(AgencyCategory::getCategoryName)
            .collect(Collectors.toList());
        return ResponseEntity.ok(categoryNames);
    }
} 