package com.SmartWallet.wallet.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    private String profilePicture;

    // NEW FIELD: Role (e.g., "ROLE_USER", "ROLE_ADMIN")
    private String role;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private Account account;
}