package com.onlinebookstore.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.onlinebookstore.dto.BookDTO;
import com.onlinebookstore.dto.CartDTO;
import com.onlinebookstore.dto.OrderDTO;
import com.onlinebookstore.dto.PlaceOrderDTO;
import com.onlinebookstore.entity.Book;
import com.onlinebookstore.entity.CartItems;
import com.onlinebookstore.entity.Order;
import com.onlinebookstore.entity.User;
import com.onlinebookstore.enums.OrderStatus;
import com.onlinebookstore.exception.ResourceNotFoundException;
import com.onlinebookstore.repository.BookRepository;
import com.onlinebookstore.repository.CartItemsRepository;
import com.onlinebookstore.repository.OrderRepository;
import com.onlinebookstore.repository.UserRepository;
import com.onlinebookstore.mapper.BookMapper;
import com.onlinebookstore.mapper.CartMapper;
import com.onlinebookstore.mapper.OrderMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CustomerServiceImpl implements CustomerService{

	private final BookRepository bookRepository;
	private final OrderRepository orderRepository;
	private final CartItemsRepository cartItemsRepository;
	private final UserRepository userRepository;
	private final BookMapper bookMapper;
	private final CartMapper cartMapper;
	private final OrderMapper orderMapper;

@Override
@Transactional(readOnly = true)
public List<BookDTO> getAllBooks() {
	return bookRepository.findAll().stream().map(bookMapper::toDTO).collect(Collectors.toList());
}


@Override
@Transactional(readOnly = true)
public List<BookDTO> searchBookByTitle(String title){
	return bookRepository.findAllByTitleContaining(title).stream().map(bookMapper::toDTO).collect(Collectors.toList());
}

@Override
public ResponseEntity<?> addBooktoCart(CartDTO cartDTO) {
    try {
        log.info("Adding book to cart - User ID: {}, Book ID: {}", cartDTO.getUserId(), cartDTO.getBookId());

        // Fetch the pending order for the user
        Order pendingOrder = orderRepository.findByUserIdAndOrderStatus(cartDTO.getUserId(), OrderStatus.PENDING);

        if (pendingOrder == null) {
            User user = userRepository.findById(cartDTO.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            pendingOrder = new Order();
            pendingOrder.setUser(user);
            pendingOrder.setOrderStatus(OrderStatus.PENDING);
            pendingOrder.setPrice(0L);
            pendingOrder.setDate(new Date());
            pendingOrder.setCartItems(new ArrayList<>());
            pendingOrder = orderRepository.save(pendingOrder);
        }

        Optional<CartItems> optionalCartItem = cartItemsRepository.findByUserIdAndBookIdAndOrderId(
                cartDTO.getUserId(), cartDTO.getBookId(), pendingOrder.getId()
        );

        if (optionalCartItem.isPresent()) {
            CartItems existingCartItem = optionalCartItem.get();
            Book book = existingCartItem.getBook();

            existingCartItem.setQuantity(existingCartItem.getQuantity() + 1);
            existingCartItem.setPrice(existingCartItem.getPrice() + book.getPrice());

            CartItems updatedCartItem = cartItemsRepository.save(existingCartItem);

            pendingOrder.setPrice(pendingOrder.getPrice() + book.getPrice());
            orderRepository.save(pendingOrder);

            CartDTO updatedCartItemDTO = new CartDTO();
            updatedCartItemDTO.setId(updatedCartItem.getId());
            updatedCartItemDTO.setPrice(updatedCartItem.getPrice());
            updatedCartItemDTO.setQuantity(updatedCartItem.getQuantity());
            updatedCartItemDTO.setBookId(updatedCartItem.getBook().getId());
            updatedCartItemDTO.setOrderId(pendingOrder.getId());
            updatedCartItemDTO.setBookTitle(updatedCartItem.getBook().getTitle());
            updatedCartItemDTO.setUserId(updatedCartItem.getUser().getId());

            return ResponseEntity.status(HttpStatus.OK).body(updatedCartItemDTO);
        } else {
            Optional<Book> optionalBook = bookRepository.findById(cartDTO.getBookId());
            Optional<User> optionalUser = userRepository.findById(cartDTO.getUserId());

            if (optionalBook.isPresent() && optionalUser.isPresent()) {
                Book book = optionalBook.get();
                User user = optionalUser.get();

                CartItems cartItems = new CartItems();
                cartItems.setBook(book);
                cartItems.setUser(user);
                cartItems.setQuantity(1L);
                cartItems.setOrder(pendingOrder);
                cartItems.setPrice(book.getPrice());

                CartItems updatedCart = cartItemsRepository.save(cartItems);

                pendingOrder.setPrice(pendingOrder.getPrice() + cartItems.getPrice());
                pendingOrder.getCartItems().add(updatedCart);
                orderRepository.save(pendingOrder);

                CartDTO updatedCartItemDTO = new CartDTO();
                updatedCartItemDTO.setId(updatedCart.getId());
                updatedCartItemDTO.setPrice(updatedCart.getPrice());
                updatedCartItemDTO.setQuantity(updatedCart.getQuantity());
                updatedCartItemDTO.setBookId(updatedCart.getBook().getId());
                updatedCartItemDTO.setOrderId(pendingOrder.getId());
                updatedCartItemDTO.setBookTitle(book.getTitle());
                updatedCartItemDTO.setUserId(user.getId());

                log.info("Book added to cart successfully - Cart Item ID: {}", updatedCart.getId());
                return ResponseEntity.status(HttpStatus.CREATED).body(updatedCartItemDTO);
            } else {
                throw new ResourceNotFoundException("User or book not found");
            }
        }
    } catch (Exception e) {
        log.error("Error adding book to cart - User ID: {}, Book ID: {}", cartDTO.getUserId(), cartDTO.getBookId(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding book to cart: " + e.getMessage());
    }
}

@Override
@Transactional(readOnly = true)
public OrderDTO getCartByUserId(Long userId) {
	Order pendingOrder=orderRepository.findByUserIdAndOrderStatus(userId, OrderStatus.PENDING);
	List<CartDTO> cartDTOList=pendingOrder.getCartItems().stream().map(cartMapper::toDTO).collect(Collectors.toList());
	OrderDTO orderDTO=new OrderDTO();
	orderDTO.setCartDTO(cartDTOList);
	orderDTO.setAmount(pendingOrder.getPrice());
	orderDTO.setId(pendingOrder.getId());
	orderDTO.setOrderStatus(pendingOrder.getOrderStatus());
	return orderDTO;
}

@Override
public OrderDTO addMinusBook(Long userId,Long bookId) {
	Order pendingOrder =orderRepository.findByUserIdAndOrderStatus(userId, OrderStatus.PENDING);
	Optional<Book> optionalBook=bookRepository.findById(bookId);
	Optional<CartItems> optionalCartItems=cartItemsRepository.findByUserIdAndBookIdAndOrderId(userId, bookId, pendingOrder.getId());
	
	if(optionalCartItems.isPresent() && optionalBook.isPresent()) {
		CartItems cartItem=optionalCartItems.get();
		cartItem.setQuantity(cartItem.getQuantity()-1);
		cartItem.setPrice(optionalCartItems.get().getPrice() - optionalBook.get().getPrice());
		pendingOrder.setPrice(pendingOrder.getPrice() - optionalBook.get().getPrice());
		cartItemsRepository.save(cartItem);
		orderRepository.save(pendingOrder);
		
		OrderDTO orderDTO=new OrderDTO();
		orderDTO.setId(pendingOrder.getId());
		orderDTO.setOrderDescription(pendingOrder.getDescription());
		orderDTO.setDate(pendingOrder.getDate());
		orderDTO.setAmount(pendingOrder.getPrice());
		orderDTO.setAddress(pendingOrder.getAddress());
		orderDTO.setOrderStatus(pendingOrder.getOrderStatus());
		orderDTO.setPaymentType(pendingOrder.getPaymentType());
		orderDTO.setUsername(pendingOrder.getUser().getName());

		List<CartDTO> cartDTOList=pendingOrder.getCartItems().stream().map(cartMapper::toDTO).collect(Collectors.toList());
		orderDTO.setCartDTO(cartDTOList);
		return orderDTO;
	}
	return null;

	}
	@Override
	public OrderDTO addPlusBook(Long userId, Long bookId) {
		Order pendingOrder=orderRepository.findByUserIdAndOrderStatus(userId, OrderStatus.PENDING);
		Optional<Book> optionalBook=bookRepository.findById(bookId);
		Optional<CartItems> optionalCartItems=cartItemsRepository.findByUserIdAndBookIdAndOrderId(userId, bookId, pendingOrder.getId());
		
		if(optionalCartItems.isPresent() && optionalBook.isPresent()) {
			CartItems cartItem=optionalCartItems.get();
			cartItem.setQuantity(cartItem.getQuantity()+1);
			cartItem.setPrice(optionalCartItems.get().getPrice() + optionalBook.get().getPrice());
			pendingOrder.setPrice(pendingOrder.getPrice() + optionalBook.get().getPrice());
			
			cartItemsRepository.save(cartItem);
			orderRepository.save(pendingOrder);
			
			OrderDTO orderDTO=new OrderDTO();
			orderDTO.setId(pendingOrder.getId());
			orderDTO.setOrderDescription(null);
			orderDTO.setDate(pendingOrder.getDate());
			orderDTO.setAmount(pendingOrder.getPrice());
			orderDTO.setAddress(pendingOrder.getAddress());
			orderDTO.setOrderStatus(pendingOrder.getOrderStatus());
			orderDTO.setPaymentType(pendingOrder.getPaymentType());
			orderDTO.setUsername(pendingOrder.getUser().getName());

			List<CartDTO> cartDTOList=pendingOrder.getCartItems().stream().map(cartMapper::toDTO).collect(Collectors.toList());
			orderDTO.setCartDTO(cartDTOList);
			return orderDTO;
		}
		return null;
	}
	
	@Override
	public OrderDTO placeOrder(PlaceOrderDTO placeOrderDTO) {
		Order existingOrder=orderRepository.findByUserIdAndOrderStatus(placeOrderDTO.getUserId(), OrderStatus.PENDING);
		Optional<User> optionalUser=userRepository.findById(placeOrderDTO.getUserId());
		
		if(optionalUser.isPresent())
		{
			User user=optionalUser.get();
			
			if(existingOrder!=null)
			{
				existingOrder.setOrderStatus(OrderStatus.SUBMITTED);
				existingOrder.setAddress(placeOrderDTO.getAddress());
				existingOrder.setDate(new Date());
				existingOrder.setPaymentType(placeOrderDTO.getPayment());
				existingOrder.setDescription(placeOrderDTO.getOrderDescription());
				existingOrder.setPrice(existingOrder.getPrice());
				orderRepository.save(existingOrder);
			}
			else {
				existingOrder=new Order();
				existingOrder.setOrderStatus(OrderStatus.SUBMITTED);
				existingOrder.setUser(user);
				existingOrder.setPrice(0L);
				existingOrder.setAddress(placeOrderDTO.getAddress());
				existingOrder.setDate(new Date());
				existingOrder.setPaymentType(placeOrderDTO.getPayment());
				existingOrder.setDescription(placeOrderDTO.getOrderDescription());
				orderRepository.save(existingOrder);
			}

			OrderDTO orderDTO=orderMapper.toDTO(existingOrder);
			orderDTO.setOrder(existingOrder);
			return orderDTO;
		}
		return null;
	}

	@Override
	@Transactional(readOnly = true)
	public List<OrderDTO> getOrdersByUserId(Long userId){
		return orderRepository.findAllByUserIdAndOrderStatus(userId, OrderStatus.SUBMITTED).stream().map(orderMapper::toDTO).collect(Collectors.toList());
	}
	
	@Override
	public void removeBookFromCart(Long userId, Long bookId) {
	    Order pendingOrder = orderRepository.findByUserIdAndOrderStatus(userId, OrderStatus.PENDING);
	    if (pendingOrder != null) {
	        Optional<CartItems> optionalCartItem = cartItemsRepository.findByUserIdAndBookIdAndOrderId(userId, bookId, pendingOrder.getId());
	        if (optionalCartItem.isPresent()) {
	            CartItems cartItem = optionalCartItem.get();
	            pendingOrder.setPrice(pendingOrder.getPrice() - cartItem.getPrice());
	            cartItemsRepository.delete(cartItem);
	            orderRepository.save(pendingOrder);
	        } 
	    } else {
	        throw new IllegalArgumentException("No pending order found for the user");
	    }
	}
}
