package com.SmartWallet.wallet.config;

import com.SmartWallet.wallet.entities.Account;
import com.SmartWallet.wallet.entities.User;
import com.SmartWallet.wallet.repositories.AccountRepository;
import com.SmartWallet.wallet.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        System.out.println("Checking for Admin user...");

        try {
            // Check if admin exists
            if (userRepository.findByUsername("admin").isEmpty()) {
                System.out.println("Admin user not found. Creating...");

                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setEmail("admin@smartwallet.com");
                admin.setRole("ROLE_ADMIN");
                admin.setProfilePicture("https://api.dicebear.com/9.x/bottts/svg?seed=admin");

                // Save User first
                User savedAdmin = userRepository.save(admin);

                // Create Account
                Account adminAccount = new Account();
                adminAccount.setUser(savedAdmin);
                adminAccount.setBalance(new BigDecimal("1000000")); // Rich admin!
                accountRepository.save(adminAccount);

                System.out.println("ADMIN USER CREATED SUCCESSFULLY");
                System.out.println("Username: admin");
                System.out.println("Password: admin123");
            } else {
                System.out.println("Admin user already exists.");
            }
        } catch (Exception e) {
            System.err.println("Error creating admin user: " + e.getMessage());
            e.printStackTrace();
        }
    }
}