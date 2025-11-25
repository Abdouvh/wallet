package com.SmartWallet.wallet.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String email; // Optional, but good practice
    private BigDecimal initialBalance; // For this demo app
}