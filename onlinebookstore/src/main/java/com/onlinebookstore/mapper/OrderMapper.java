package com.onlinebookstore.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.onlinebookstore.dto.CartDTO;
import com.onlinebookstore.dto.OrderDTO;
import com.onlinebookstore.entity.CartItems;
import com.onlinebookstore.entity.Order;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OrderMapper {

    private final CartMapper cartMapper;

    public OrderDTO toDTO(Order order) {
        if (order == null) {
            return null;
        }

        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(order.getId());
        orderDTO.setOrderStatus(order.getOrderStatus());
        orderDTO.setAmount(order.getPrice());
        orderDTO.setAddress(order.getAddress());
        orderDTO.setPaymentType(order.getPaymentType());
        orderDTO.setDate(order.getDate());
        orderDTO.setOrderDescription(order.getDescription());

        if (order.getUser() != null) {
            orderDTO.setUsername(order.getUser().getName());
        }

        if (order.getCartItems() != null) {
            List<CartDTO> cartDTOList = order.getCartItems().stream()
                    .map(cartMapper::toDTO)
                    .collect(Collectors.toList());
            orderDTO.setCartDTO(cartDTOList);
        }

        return orderDTO;
    }
}
