package com.SmartWallet.wallet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private Long userId; // <--- THIS IS THE MISSING KEY
}