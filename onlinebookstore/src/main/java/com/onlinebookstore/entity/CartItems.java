package com.onlinebookstore.entity;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.onlinebookstore.dto.CartDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="cartItems")
public class CartItems {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	private long price;
	private Long quantity;
	
	@ManyToOne(fetch=FetchType.LAZY,optional=false)
	@JoinColumn(name="book_id",nullable=false)
	@OnDelete(action=OnDeleteAction.CASCADE)
	@JsonIgnore
	private Book book;
	
	@ManyToOne(fetch=FetchType.LAZY,optional=false)
	@JoinColumn(name="user_id",nullable=false)
	@OnDelete(action=OnDeleteAction.CASCADE)
	@JsonIgnore
	private User user;
	
	@ManyToOne(fetch=FetchType.LAZY,optional=false)
	@JoinColumn(name="order_id")
	private Order order;
	
	public CartDTO getCartDTO() {
		CartDTO cartDTO = new CartDTO();
		cartDTO.setId(id);
		cartDTO.setQuantity(quantity);
		cartDTO.setBookId(book.getId());
		cartDTO.setBookTitle(book.getTitle());
		cartDTO.setPrice(price);
		cartDTO.setUserId(user.getId());
		return cartDTO;
		
	}
	
	
}
