package com.govcomplaint.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String displayName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType userType;

    private String agencyName;

    @ElementCollection
    @CollectionTable(name = "user_categories", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "category")
    private Set<String> categories = new HashSet<>();

    // Constructor for basic user creation
    public User(String email, String password, UserType userType) {
        this.email = email;
        this.password = password;
        this.userType = userType;
        this.displayName = email.split("@")[0]; // Default display name from email
    }

    // Constructor for agency user
    public User(String email, String password, String agencyName, Set<String> categories) {
        this.email = email;
        this.password = password;
        this.userType = UserType.AGENCY;
        this.agencyName = agencyName;
        this.categories = categories;
        this.displayName = agencyName;
    }

    // Constructor for citizen user
    public User(String email, String password, String displayName) {
        this.email = email;
        this.password = password;
        this.userType = UserType.CITIZEN;
        this.displayName = displayName;
    }
}