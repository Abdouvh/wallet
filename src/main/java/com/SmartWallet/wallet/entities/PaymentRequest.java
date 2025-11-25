package com.SmartWallet.wallet.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_requests")
@Data
public class PaymentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester; // Who is asking for money?

    @ManyToOne
    @JoinColumn(name = "payer_id", nullable = false)
    private User payer; // Who needs to pay?

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private RequestStatus status; // PENDING, PAID, DECLINED

    private LocalDateTime timestamp;

    public enum RequestStatus {
        PENDING, PAID, DECLINED
    }
}