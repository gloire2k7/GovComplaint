package com.govcomplaint.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "agency_categories")
@Data
@NoArgsConstructor
public class AgencyCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agency_id", nullable = false)
    @JsonIgnore
    private Agency agency;

    @Column(name = "category_name", nullable = false)
    private String categoryName;
} 