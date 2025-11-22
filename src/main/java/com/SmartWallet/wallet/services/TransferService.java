package com.SmartWallet.wallet.services;




import com.SmartWallet.wallet.entities.Account;
import com.SmartWallet.wallet.entities.Transaction;
import com.SmartWallet.wallet.repositories.AccountRepository;
import com.SmartWallet.wallet.repositories.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TransferService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Transactional // The Magic Annotation: All or Nothing!
    public void transferFunds(Long sourceAccountId, Long targetAccountId, BigDecimal amount) {

        // 1. Validate Amount
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Transfer amount must be positive");
        }

        // 2. Retrieve Accounts
        // In a real app, handle "Account Not Found" with a custom exception
        Account sourceAccount = accountRepository.findById(sourceAccountId)
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        Account targetAccount = accountRepository.findById(targetAccountId)
                .orElseThrow(() -> new RuntimeException("Target account not found"));

        // 3. Check Balance
        if (sourceAccount.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        // 4. Perform Transfer
        // Subtract from source
        sourceAccount.setBalance(sourceAccount.getBalance().subtract(amount));

        // Add to target
        targetAccount.setBalance(targetAccount.getBalance().add(amount));

        // Save updates to DB
        accountRepository.save(sourceAccount);
        accountRepository.save(targetAccount);

        // 5. Create Transaction Record
        Transaction transaction = new Transaction();
        transaction.setSourceAccount(sourceAccount);
        transaction.setTargetAccount(targetAccount);
        transaction.setAmount(amount);
        transaction.setTimestamp(LocalDateTime.now());

        transactionRepository.save(transaction);
    }
}