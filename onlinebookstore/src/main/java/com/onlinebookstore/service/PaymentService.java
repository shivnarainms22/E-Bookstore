package com.onlinebookstore.service;

import com.onlinebookstore.dto.PaymentDTO;
import com.onlinebookstore.dto.PaymentResponseDTO;

public interface PaymentService {
    
    /**
     * Creates a Stripe PaymentIntent for processing payment
     * @param paymentDTO Payment details including amount and currency
     * @return PaymentResponseDTO containing client secret for frontend
     */
    PaymentResponseDTO createPaymentIntent(PaymentDTO paymentDTO);
    
    /**
     * Confirms a payment and updates order status
     * @param paymentIntentId The Stripe PaymentIntent ID
     * @param orderId The order ID to update
     * @return PaymentResponseDTO with payment status
     */
    PaymentResponseDTO confirmPayment(String paymentIntentId, Long orderId);
    
    /**
     * Retrieves the status of a payment
     * @param paymentIntentId The Stripe PaymentIntent ID
     * @return PaymentResponseDTO with current payment status
     */
    PaymentResponseDTO getPaymentStatus(String paymentIntentId);
}

