package com.onlinebookstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PlaceOrderDTO {
	@NotNull(message = "User ID is required")
	private Long userId;

	@NotBlank(message = "Address is required")
	@Size(min = 10, max = 500, message = "Address must be between 10 and 500 characters")
	private String address;

	@Size(max = 1000, message = "Order description must not exceed 1000 characters")
	private String orderDescription;

	@NotBlank(message = "Payment method is required")
	@Size(max = 50, message = "Payment method must not exceed 50 characters")
	private String payment;
}
