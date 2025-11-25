package com.SmartWallet.wallet.controllers;

import com.SmartWallet.wallet.dto.JwtResponse;
import com.SmartWallet.wallet.dto.LoginRequest;
import com.SmartWallet.wallet.entities.User;
import com.SmartWallet.wallet.repositories.UserRepository;
import com.SmartWallet.wallet.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // <--- THIS WAS MISSING
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = jwtUtils.generateToken(userDetails);

        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        // Return token, ID, and Role
        return ResponseEntity.ok(new JwtResponse(jwt, user.getId(), user.getRole()));
    }
}