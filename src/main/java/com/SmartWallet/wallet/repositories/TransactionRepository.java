package com.SmartWallet.wallet.repositories;


import com.SmartWallet.wallet.entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // Find all transactions where the account is either source or target
    List<Transaction> findBySourceAccountIdOrTargetAccountId(Long sourceId, Long targetId);
}