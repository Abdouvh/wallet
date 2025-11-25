package com.SmartWallet.wallet.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contacts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // The person who owns this contact list

    @Column(nullable = false)
    private String contactName; // e.g., "Mom", "Best Friend"

    @Column(nullable = false)
    private String email; // We use email to find the account

    // We can optionally store the account ID directly for faster lookups
    private Long accountId;
}