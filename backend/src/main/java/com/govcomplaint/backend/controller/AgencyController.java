package com.govcomplaint.backend.controller;

import com.govcomplaint.backend.model.Agency;
import com.govcomplaint.backend.model.AgencyCategory;
import com.govcomplaint.backend.repository.AgencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/agencies")
@CrossOrigin(origins = "*")
public class AgencyController {

    @Autowired
    private AgencyRepository agencyRepository;

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
} 