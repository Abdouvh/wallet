package com.SmartWallet.wallet.dto;


import lombok.Data;
import java.math.BigDecimal;

@Data
public class TransferRequest {
    private Long sourceAccountId;
    private Long targetAccountId;
    private BigDecimal amount;
}