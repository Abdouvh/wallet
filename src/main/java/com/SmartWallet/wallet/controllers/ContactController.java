package com.SmartWallet.wallet.controllers;

import com.SmartWallet.wallet.entities.Account;
import com.SmartWallet.wallet.entities.Contact;
import com.SmartWallet.wallet.entities.User;
import com.SmartWallet.wallet.repositories.AccountRepository;
import com.SmartWallet.wallet.repositories.ContactRepository;
import com.SmartWallet.wallet.repositories.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ContactController {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Contact>> getContacts(@PathVariable Long userId) {
        return ResponseEntity.ok(contactRepository.findByUserId(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addContact(@RequestBody ContactRequest request) {
        // 1. Validate User
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Find the contact's account by email
        User contactUser = userRepository.findByUsername(request.getEmail()) // Using username for simplicity or add findByEmail
                .or(() -> userRepository.findByEmail(request.getEmail())) // Better: find by email
                .orElseThrow(() -> new RuntimeException("Contact user not found with that email/username"));

        if (contactUser.getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body("You cannot add yourself as a contact.");
        }

        Account contactAccount = contactUser.getAccount();

        // 3. Save Contact
        Contact contact = new Contact();
        contact.setUser(user);
        contact.setContactName(request.getName());
        contact.setEmail(request.getEmail());
        contact.setAccountId(contactAccount.getId());

        contactRepository.save(contact);

        return ResponseEntity.ok("Contact added successfully!");
    }

    @Data
    static class ContactRequest {
        private Long userId;
        private String name;
        private String email; // Or username of the friend
    }
}