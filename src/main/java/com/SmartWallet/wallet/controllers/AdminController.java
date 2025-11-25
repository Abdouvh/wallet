package com.SmartWallet.wallet.controllers;

import com.SmartWallet.wallet.entities.Transaction;
import com.SmartWallet.wallet.entities.User;
import com.SmartWallet.wallet.repositories.TransactionRepository;
import com.SmartWallet.wallet.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository; // <--- Inject this

    // Get ALL users
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // Get ALL transactions (Global Audit Log)
    @GetMapping("/transactions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionRepository.findAll());
    }

    // Delete a user (Ban Hammer)
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}