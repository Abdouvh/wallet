package com.SmartWallet.wallet.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal amount;

    // Who sent the money?
    @ManyToOne
    @JoinColumn(name = "source_account_id")
    private Account sourceAccount;

    // Who received the money?
    @ManyToOne
    @JoinColumn(name = "target_account_id")
    private Account targetAccount;

    @CreationTimestamp // Automatically sets the time when saved
    private LocalDateTime timestamp;

    // Status could be added later (PENDING, SUCCESS, FAILED)
}