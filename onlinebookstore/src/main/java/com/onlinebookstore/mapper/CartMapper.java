package com.onlinebookstore.mapper;

import org.springframework.stereotype.Component;

import com.onlinebookstore.dto.CartDTO;
import com.onlinebookstore.entity.CartItems;

@Component
public class CartMapper {

    public CartDTO toDTO(CartItems cartItems) {
        if (cartItems == null) {
            return null;
        }

        CartDTO cartDTO = new CartDTO();
        cartDTO.setId(cartItems.getId());
        cartDTO.setPrice(cartItems.getPrice());
        cartDTO.setQuantity(cartItems.getQuantity());

        if (cartItems.getBook() != null) {
            cartDTO.setBookId(cartItems.getBook().getId());
            cartDTO.setBookTitle(cartItems.getBook().getTitle());
        }

        if (cartItems.getUser() != null) {
            cartDTO.setUserId(cartItems.getUser().getId());
        }

        if (cartItems.getOrder() != null) {
            cartDTO.setOrderId(cartItems.getOrder().getId());
        }

        return cartDTO;
    }
}
