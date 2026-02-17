package com.onlinebookstore.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDTO {
    private String clientSecret;
    private String paymentIntentId;
    private String status;
    private Long amount;
    private String currency;
    private String message;
    private boolean success;
}

