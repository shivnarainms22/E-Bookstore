package com.onlinebookstore.dto;

import lombok.Data;

@Data
public class PaymentDTO {
    private Long userId;
    private Long orderId;
    private Long amount; // Amount in smallest currency unit (e.g., cents/paise)
    private String currency;
    private String paymentMethodId;
    private String description;
    private String address;
    private String orderDescription;
}

