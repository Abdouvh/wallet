package com.SmartWallet.wallet.repositories;

import com.SmartWallet.wallet.entities.PaymentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRequestRepository extends JpaRepository<PaymentRequest, Long> {
    // Requests sent TO me (I need to pay)
    List<PaymentRequest> findByPayerId(Long payerId);

    // Requests sent BY me (I am waiting for money)
    List<PaymentRequest> findByRequesterId(Long requesterId);
}