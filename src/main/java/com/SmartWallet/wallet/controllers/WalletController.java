package com.SmartWallet.wallet.controllers;




import com.SmartWallet.wallet.dto.TransferRequest;
import com.SmartWallet.wallet.entities.Account;
import com.SmartWallet.wallet.entities.Transaction;
import com.SmartWallet.wallet.repositories.AccountRepository;
import com.SmartWallet.wallet.repositories.TransactionRepository;
import com.SmartWallet.wallet.services.TransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "http://localhost:5173") // Allow React (Vite) to access this
public class WalletController {

    @Autowired
    private TransferService transferService;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    // 1. Transfer Money
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

    // 2. Get Balance
    @GetMapping("/{id}/balance")
    public ResponseEntity<Account> getAccount(@PathVariable Long id) {
        return accountRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Get Transaction History
    @GetMapping("/{id}/transactions")
    public ResponseEntity<List<Transaction>> getTransactions(@PathVariable Long id) {
        // Note: Ideally, we should fetch transactions where Source OR Target is this ID
        // For simplicity, we are using the repository method we created earlier
        return ResponseEntity.ok(
                transactionRepository.findBySourceAccountIdOrTargetAccountId(id, id)
        );
    }
}