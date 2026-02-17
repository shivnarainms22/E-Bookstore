package com.onlinebookstore.dto;

import lombok.Data;

@Data
public class CartDTO {
	private Long id;
	private long price;
	private Long quantity;
	private Long bookId;
	private Long orderId;
	private String bookTitle;
	private Long userId;
	

}
