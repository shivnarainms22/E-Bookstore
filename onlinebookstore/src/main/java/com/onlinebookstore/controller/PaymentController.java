package com.onlinebookstore.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.onlinebookstore.dto.PaymentDTO;
import com.onlinebookstore.dto.PaymentResponseDTO;
import com.onlinebookstore.service.PaymentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment")
@Slf4j
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Value("${stripe.publishable.key}")
    private String stripePublishableKey;

    /**
     * Get Stripe publishable key for frontend
     */
    @GetMapping("/config")
    public ResponseEntity<Map<String, String>> getStripeConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("publishableKey", stripePublishableKey);
        return ResponseEntity.ok(config);
    }

    /**
     * Create a payment intent for processing payment
     */
    @PostMapping("/create-payment-intent")
    public ResponseEntity<PaymentResponseDTO> createPaymentIntent(@RequestBody PaymentDTO paymentDTO) {
        log.info("Creating payment intent for user: {}, amount: {}", 
                paymentDTO.getUserId(), paymentDTO.getAmount());
        
        PaymentResponseDTO response = paymentService.createPaymentIntent(paymentDTO);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Confirm payment after successful Stripe transaction
     */
    @PostMapping("/confirm")
    public ResponseEntity<PaymentResponseDTO> confirmPayment(
            @RequestParam String paymentIntentId,
            @RequestParam Long orderId) {
        log.info("Confirming payment for order: {}, paymentIntent: {}", orderId, paymentIntentId);
        
        PaymentResponseDTO response = paymentService.confirmPayment(paymentIntentId, orderId);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Get payment status
     */
    @GetMapping("/status/{paymentIntentId}")
    public ResponseEntity<PaymentResponseDTO> getPaymentStatus(@PathVariable String paymentIntentId) {
        log.info("Getting payment status for: {}", paymentIntentId);
        
        PaymentResponseDTO response = paymentService.getPaymentStatus(paymentIntentId);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}

