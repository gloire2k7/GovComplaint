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
@CrossOrigin(origins = "*")
public class AgencyController {

    @Autowired
    private AgencyRepository agencyRepository;

    @Autowired
    private AgencyCategoryRepository agencyCategoryRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllAgencies() {
        List<Agency> agencies = agencyRepository.findAll();
        List<Map<String, Object>> agencyDtos = agencies.stream()
            .map(agency -> Map.of(
                "id", agency.getId(),
                "name", agency.getAgencyName(),
                "categories", agency.getCategories().stream()
                    .map(AgencyCategory::getCategoryName)
                    .collect(Collectors.toList())
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(agencyDtos);
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