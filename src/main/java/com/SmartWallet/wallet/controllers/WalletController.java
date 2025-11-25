package com.SmartWallet.wallet.controllers;

import com.SmartWallet.wallet.dto.TransferRequest;
import com.SmartWallet.wallet.entities.Account;
import com.SmartWallet.wallet.entities.Transaction;
import com.SmartWallet.wallet.repositories.AccountRepository;
import com.SmartWallet.wallet.repositories.TransactionRepository;
import com.SmartWallet.wallet.services.TransferService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "http://localhost:5173")
public class WalletController {

    @Autowired
    private TransferService transferService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    // --- Inner DTO for Deposit/Withdrawal requests ---
    @Data
    static class BalanceRequest {
        private Long accountId;
        private BigDecimal amount;
    }

    // --- New Endpoints ---

    @PostMapping("/deposit")
    public ResponseEntity<String> deposit(@RequestBody BalanceRequest request) {
        try {
            transferService.deposit(request.getAccountId(), request.getAmount());
            return ResponseEntity.ok("Deposit successful");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/withdraw")
    public ResponseEntity<String> withdraw(@RequestBody BalanceRequest request) {
        try {
            transferService.withdraw(request.getAccountId(), request.getAmount());
            return ResponseEntity.ok("Withdrawal successful");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- Existing Endpoints ---

    @PostMapping("/transfer")
    public ResponseEntity<String> transfer(@RequestBody TransferRequest request) {
        try {
            transferService.transferFunds(
                    request.getSourceAccountId(),
                    request.getTargetAccountId(),
                    request.getAmount()
            );
            return ResponseEntity.ok("Transfer successful");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{userId}/balance")
    public ResponseEntity<Account> getAccount(@PathVariable Long userId) {
        return accountRepository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{userId}/transactions")
    public ResponseEntity<List<Transaction>> getTransactions(@PathVariable Long userId) {
        Account account = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        return ResponseEntity.ok(
                transactionRepository.findBySourceAccountIdOrTargetAccountId(account.getId(), account.getId())
        );
    }
}