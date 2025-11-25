package com.SmartWallet.wallet.controllers;

import com.SmartWallet.wallet.dto.RegisterRequest;
import com.SmartWallet.wallet.dto.UpdateProfileRequest; // Import the new DTO
import com.SmartWallet.wallet.entities.Account;
import com.SmartWallet.wallet.entities.User;
import com.SmartWallet.wallet.repositories.AccountRepository;
import com.SmartWallet.wallet.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail() != null ? request.getEmail() : request.getUsername() + "@test.com");

        // Set a default avatar if none provided
        user.setProfilePicture("https://api.dicebear.com/9.x/avataaars/svg?seed=" + request.getUsername());

        // CRITICAL: Set the Role
        user.setRole("ROLE_USER");

        user = userRepository.save(user);

        Account account = new Account();
        account.setUser(user);
        account.setBalance(request.getInitialBalance());
        accountRepository.save(account);

        return ResponseEntity.ok("User registered successfully!");
    }

    // --- NEW UPDATE ENDPOINT ---
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateProfileRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update Email if provided
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            user.setEmail(request.getEmail());
        }

        // Update Password if provided
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // Update Profile Picture if provided
        if (request.getProfilePicture() != null && !request.getProfilePicture().isEmpty()) {
            user.setProfilePicture(request.getProfilePicture());
        }

        userRepository.save(user);
        return ResponseEntity.ok("User profile updated successfully!");
    }
}