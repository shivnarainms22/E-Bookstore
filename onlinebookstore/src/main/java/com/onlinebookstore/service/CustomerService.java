package com.onlinebookstore.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.onlinebookstore.dto.BookDTO;
import com.onlinebookstore.dto.CartDTO;
import com.onlinebookstore.dto.OrderDTO;
import com.onlinebookstore.dto.PlaceOrderDTO;

public interface CustomerService {
	List<BookDTO> getAllBooks();

	List<BookDTO> searchBookByTitle(String title);

	ResponseEntity<?> addBooktoCart(CartDTO cartDTO);

	OrderDTO getCartByUserId(Long userId);

	OrderDTO addMinusBook(Long userld, Long productid);

	OrderDTO addPlusBook(Long userId, Long productid);

	OrderDTO placeOrder(PlaceOrderDTO placeOrderDTO);

	List<OrderDTO> getOrdersByUserId(Long userId);
	
	void removeBookFromCart(Long userId, Long bookId);
}
