package com.onlinebookstore.dto;

import java.util.Date;
import java.util.List;

import com.onlinebookstore.entity.Order;
import com.onlinebookstore.enums.OrderStatus;

import lombok.Data;
@Data
public class OrderDTO {
	private String orderDescription;
	private List<CartDTO> cartDTO;
	private Long id;
	private Date date;
	private Long amount;
	private String address;
	private OrderStatus orderStatus;
	private String paymentType;
	private String username;
	private Order order;
	
	
}
