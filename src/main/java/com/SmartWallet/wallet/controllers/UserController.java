package com.SmartWallet.wallet.controllers;

import com.SmartWallet.wallet.entities.Account;
import com.SmartWallet.wallet.entities.User;
import com.SmartWallet.wallet.repositories.AccountRepository;
import com.SmartWallet.wallet.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor // Automatically creates constructor for all 'final' fields
public class UserController {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder; // Injected here

    @PostMapping("/create")
    public User createUser(@RequestParam String username, @RequestParam BigDecimal initialBalance) {
        User user = new User();
        user.setUsername(username);

        // Securely hash the password before saving
        user.setPassword(passwordEncoder.encode("password"));

        user.setEmail(username + "@test.com");

        // Save User
        user = userRepository.save(user);

        // Create and Save Account
        Account account = new Account();
        account.setUser(user);
        account.setBalance(initialBalance);
        accountRepository.save(account);

        return user;
    }
}