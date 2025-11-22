package com.SmartWallet.wallet.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users") // 'user' is a reserved keyword in Postgres, so we use 'users'
@Data // Lombok: Generates getters, setters, toString, etc.
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password; // We will store the BCrypt hash here, not plain text!

    @Column(unique = true, nullable = false)
    private String email;

    // One user has one main wallet account (for this MVP)
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Account account;

    // Inside User.java
    private String role; // e.g., "ROLE_USER", "ROLE_ADMIN"
}