package com.SmartWallet.wallet.entities;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal balance;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    // Optional: Relationship to see all transactions for this account
    @OneToMany(mappedBy = "sourceAccount")
    private List<Transaction> sentTransactions;

    @OneToMany(mappedBy = "targetAccount")
    private List<Transaction> receivedTransactions;
}