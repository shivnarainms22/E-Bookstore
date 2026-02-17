package com.onlinebookstore.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.onlinebookstore.dto.BookDTO;
import com.onlinebookstore.dto.CartDTO;
import com.onlinebookstore.dto.OrderDTO;
import com.onlinebookstore.dto.PlaceOrderDTO;
import com.onlinebookstore.service.CustomerService;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/customer")
public class CustomerController {
	private final CustomerService customerService;
	
	@GetMapping("/books")
	public ResponseEntity<List<BookDTO>> getAllBooks()
	{
		List<BookDTO> bookDtoList=customerService.getAllBooks();
		return ResponseEntity.ok(bookDtoList);
	}
	
	@GetMapping("/book/search/{title}")
	public ResponseEntity<List<BookDTO>> searchBookByTitle(@PathVariable String title)
	{
		List<BookDTO> bookDtoList=customerService.searchBookByTitle(title);
		return ResponseEntity.ok(bookDtoList);
	}
	
//	@PostMapping("/cart")
//	public ResponseEntity<?> postBookToCart(@RequestBody CartDTO cartDTO){
//		System.out.println("Received CartDTO: " +cartDTO);
//		return customerService.addBooktoCart(cartDTO);
//	}
	
	@PostMapping("/cart")
	public ResponseEntity<?> postBookToCart(@RequestBody CartDTO cartDTO) {
	    System.out.println("Received CartDTO: " + cartDTO);
	    
	    // Validate that userId and bookId are present
	    if (cartDTO.getUserId() == null || cartDTO.getBookId() == null) {
	        return ResponseEntity.badRequest().body("userId and bookId are required");
	    }

	    // Call the service layer
	    return customerService.addBooktoCart(cartDTO);
	}
	
	@GetMapping("/cart/{userId}")
	public ResponseEntity<OrderDTO> getCartByUserId(@PathVariable Long userId)
	{
		OrderDTO orderDTO=customerService.getCartByUserId(userId);
		if(orderDTO==null)
		{
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(orderDTO);
	}
	
	@GetMapping("/cart/{userId}/deduct/{bookId}")
	public ResponseEntity<OrderDTO> addMinusOnBook(@PathVariable Long userId,@PathVariable Long bookId)
	{
		OrderDTO orderDTO=customerService.addMinusBook(userId,bookId);
		return ResponseEntity.ok(orderDTO);
	}
	
	@GetMapping("/cart/{userId}/add/{bookId}")
	public ResponseEntity<OrderDTO> addPlusOnBook(@PathVariable Long userId,@PathVariable Long bookId)
	{
		OrderDTO orderDTO=customerService.addPlusBook(userId,bookId);
		return ResponseEntity.ok(orderDTO);
	}
	
	@PostMapping("/placeOrder")
	public ResponseEntity<OrderDTO> placeOrder(@RequestBody PlaceOrderDTO placeOrderDTO){
		System.out.println("Received PlaceOdrderDTO: "+placeOrderDTO);
		OrderDTO orderDTO=customerService.placeOrder(placeOrderDTO);
		if(orderDTO==null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
		return ResponseEntity.status(HttpStatus.CREATED).body(orderDTO);
		
	}
	
	@GetMapping("/orders/{userId}")
	public ResponseEntity<List<OrderDTO>> getOrdersByUserId(@PathVariable Long userId)
	{
		List<OrderDTO> orderDTOList=customerService.getOrdersByUserId(userId);
		return ResponseEntity.ok(orderDTOList);
	}
	
	@DeleteMapping("/cart/{userId}/remove/{bookId}")
	public ResponseEntity<Void> removeBookFromCart(@PathVariable Long userId, @PathVariable Long bookId) {
	    customerService.removeBookFromCart(userId, bookId);
	    return ResponseEntity.noContent().build();
	}

}