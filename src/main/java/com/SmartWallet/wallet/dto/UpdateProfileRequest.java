package com.SmartWallet.wallet.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String email;
    private String password;
    private String profilePicture;
}