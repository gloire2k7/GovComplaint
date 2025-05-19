package com.govcomplaint.backend.service;

import com.govcomplaint.backend.model.*;
import com.govcomplaint.backend.repository.*;
import com.govcomplaint.backend.util.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class AuthService {
    @Autowired
    private CitizenRepository citizenRepository;
    @Autowired
    private AgencyRepository agencyRepository;
    @Autowired
    private AgencyCategoryRepository agencyCategoryRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Object registerCitizen(String email, String password, String fullName) {
        if (citizenRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already registered");
        }
        Citizen citizen = new Citizen();
        citizen.setEmail(email);
        citizen.setPassword(passwordEncoder.encode(password));
        citizen.setUserType("CITIZEN");
        citizen.setFullName(fullName);
        citizen = citizenRepository.save(citizen);
        return new SimpleUserDTO(citizen.getId().toString(), citizen.getEmail(), citizen.getUserType(), citizen.getFullName());
    }

    public Object registerAgency(String email, String password, String agencyName, Set<String> categories) {
        if (agencyRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already registered");
            }
        Agency agency = new Agency();
        agency.setEmail(email);
        agency.setPassword(passwordEncoder.encode(password));
        agency.setUserType("AGENCY");
        agency.setAgencyName(agencyName);
        agency = agencyRepository.save(agency);
        Set<AgencyCategory> categoryEntities = new HashSet<>();
        for (String cat : categories) {
            AgencyCategory ac = new AgencyCategory();
            ac.setAgency(agency);
            ac.setCategoryName(cat);
            categoryEntities.add(ac);
        }
        agencyCategoryRepository.saveAll(categoryEntities);
        return new SimpleUserDTO(agency.getId().toString(), agency.getEmail(), agency.getUserType(), agency.getAgencyName());
    }

    public Object login(String email, String password) {
        // Try to find user in citizen repository
        Optional<Citizen> citizenOpt = citizenRepository.findByEmail(email);
        if (citizenOpt.isPresent()) {
            Citizen citizen = citizenOpt.get();
            if (passwordEncoder.matches(password, citizen.getPassword())) {
                return new SimpleUserDTO(citizen.getId().toString(), citizen.getEmail(), citizen.getUserType(), citizen.getFullName());
            }
        }

        // Try to find user in agency repository
        Optional<Agency> agencyOpt = agencyRepository.findByEmail(email);
        if (agencyOpt.isPresent()) {
            Agency agency = agencyOpt.get();
            if (passwordEncoder.matches(password, agency.getPassword())) {
                return new SimpleUserDTO(agency.getId().toString(), agency.getEmail(), agency.getUserType(), agency.getAgencyName());
            }
        }

        // If we get here, either the email wasn't found or the password was wrong
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    public static class SimpleUserDTO {
        public String id;
        public String email;
        public String userType;
        public String name;
        public SimpleUserDTO(String id, String email, String userType, String name) {
            this.id = id;
            this.email = email;
            this.userType = userType;
            this.name = name;
        }
    }
} 