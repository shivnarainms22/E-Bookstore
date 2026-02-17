package com.onlinebookstore.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.onlinebookstore.dto.PaymentDTO;
import com.onlinebookstore.dto.PaymentResponseDTO;
import com.onlinebookstore.entity.Order;
import com.onlinebookstore.enums.OrderStatus;
import com.onlinebookstore.repository.OrderRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Autowired
    private OrderRepository orderRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    @Override
    public PaymentResponseDTO createPaymentIntent(PaymentDTO paymentDTO) {
        try {
            // Validate amount
            if (paymentDTO.getAmount() == null || paymentDTO.getAmount() <= 0) {
                return PaymentResponseDTO.builder()
                        .success(false)
                        .message("Invalid payment amount")
                        .build();
            }

            // Save address and description to the order before creating payment intent
            if (paymentDTO.getOrderId() != null) {
                Order order = orderRepository.findById(paymentDTO.getOrderId()).orElse(null);
                if (order != null) {
                    if (paymentDTO.getAddress() != null) {
                        order.setAddress(paymentDTO.getAddress());
                    }
                    if (paymentDTO.getOrderDescription() != null) {
                        order.setDescription(paymentDTO.getOrderDescription());
                    }
                    orderRepository.save(order);
                    log.info("Order {} updated with address before payment", paymentDTO.getOrderId());
                }
            }

            // Set default currency if not provided
            String currency = paymentDTO.getCurrency() != null ? paymentDTO.getCurrency() : "inr";

            // Create PaymentIntent with Stripe
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(paymentDTO.getAmount() * 100) // Convert to smallest currency unit (paise for INR)
                    .setCurrency(currency)
                    .setDescription(paymentDTO.getDescription() != null ? 
                            paymentDTO.getDescription() : "Online Bookstore Order Payment")
                    .putMetadata("userId", String.valueOf(paymentDTO.getUserId()))
                    .putMetadata("orderId", String.valueOf(paymentDTO.getOrderId()))
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            log.info("PaymentIntent created successfully: {}", paymentIntent.getId());

            return PaymentResponseDTO.builder()
                    .clientSecret(paymentIntent.getClientSecret())
                    .paymentIntentId(paymentIntent.getId())
                    .status(paymentIntent.getStatus())
                    .amount(paymentDTO.getAmount())
                    .currency(currency)
                    .success(true)
                    .message("Payment intent created successfully")
                    .build();

        } catch (StripeException e) {
            log.error("Stripe error creating payment intent: {}", e.getMessage());
            return PaymentResponseDTO.builder()
                    .success(false)
                    .message("Payment processing error: " + e.getMessage())
                    .build();
        } catch (Exception e) {
            log.error("Error creating payment intent: {}", e.getMessage());
            return PaymentResponseDTO.builder()
                    .success(false)
                    .message("An unexpected error occurred")
                    .build();
        }
    }

    @Override
    public PaymentResponseDTO confirmPayment(String paymentIntentId, Long orderId) {
        try {
            // Retrieve the PaymentIntent from Stripe
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);

            if ("succeeded".equals(paymentIntent.getStatus())) {
                // Update order status to SUBMITTED
                Order order = orderRepository.findById(orderId).orElse(null);
                if (order != null) {
                    order.setOrderStatus(OrderStatus.SUBMITTED);
                    order.setPaymentType("STRIPE");
                    order.setDate(new java.util.Date()); // Set the order date to current date
                    orderRepository.save(order);
                    log.info("Order {} updated to SUBMITTED after successful payment", orderId);
                }

                return PaymentResponseDTO.builder()
                        .paymentIntentId(paymentIntentId)
                        .status(paymentIntent.getStatus())
                        .success(true)
                        .message("Payment completed successfully")
                        .build();
            } else {
                return PaymentResponseDTO.builder()
                        .paymentIntentId(paymentIntentId)
                        .status(paymentIntent.getStatus())
                        .success(false)
                        .message("Payment not completed. Status: " + paymentIntent.getStatus())
                        .build();
            }

        } catch (StripeException e) {
            log.error("Stripe error confirming payment: {}", e.getMessage());
            return PaymentResponseDTO.builder()
                    .success(false)
                    .message("Error confirming payment: " + e.getMessage())
                    .build();
        }
    }

    @Override
    public PaymentResponseDTO getPaymentStatus(String paymentIntentId) {
        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);

            return PaymentResponseDTO.builder()
                    .paymentIntentId(paymentIntentId)
                    .status(paymentIntent.getStatus())
                    .amount(paymentIntent.getAmount() / 100) // Convert back from paise
                    .currency(paymentIntent.getCurrency())
                    .success(true)
                    .message("Payment status retrieved successfully")
                    .build();

        } catch (StripeException e) {
            log.error("Stripe error getting payment status: {}", e.getMessage());
            return PaymentResponseDTO.builder()
                    .success(false)
                    .message("Error retrieving payment status: " + e.getMessage())
                    .build();
        }
    }
}

