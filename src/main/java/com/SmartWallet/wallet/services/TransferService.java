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

    @Transactional
    public void transferFunds(Long sourceAccountId, Long targetAccountId, BigDecimal amount) {
        // 1. Validate Amount
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Transfer amount must be positive");
        }

        // 2. Retrieve Accounts
        Account sourceAccount = accountRepository.findById(sourceAccountId)
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        Account targetAccount = accountRepository.findById(targetAccountId)
                .orElseThrow(() -> new RuntimeException("Target account not found"));

        // 3. Check Balance
        if (sourceAccount.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        // 4. Perform Transfer
        sourceAccount.setBalance(sourceAccount.getBalance().subtract(amount));
        targetAccount.setBalance(targetAccount.getBalance().add(amount));

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

    // --- NEW METHODS ADDED BELOW ---

    @Transactional
    public void deposit(Long accountId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Deposit amount must be positive");
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);

        // Create Transaction Record (No Source = Deposit)
        Transaction transaction = new Transaction();
        transaction.setSourceAccount(null);
        transaction.setTargetAccount(account);
        transaction.setAmount(amount);
        transaction.setTimestamp(LocalDateTime.now());

        transactionRepository.save(transaction);
    }

    @Transactional
    public void withdraw(Long accountId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Withdrawal amount must be positive");
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        // Create Transaction Record (No Target = Withdrawal)
        Transaction transaction = new Transaction();
        transaction.setSourceAccount(account);
        transaction.setTargetAccount(null);
        transaction.setAmount(amount);
        transaction.setTimestamp(LocalDateTime.now());

        transactionRepository.save(transaction);
    }
}