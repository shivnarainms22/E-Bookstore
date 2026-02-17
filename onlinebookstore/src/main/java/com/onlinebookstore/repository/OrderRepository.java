package com.onlinebookstore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.onlinebookstore.entity.Order;
import com.onlinebookstore.enums.OrderStatus;
@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {
	Order findByUserIdAndOrderStatus(Long userId, OrderStatus pending);
	List<Order> findAllByUserIdAndOrderStatus(Long userId, OrderStatus submitted);
	List<Order> findAllByOrderStatus(OrderStatus orderStatus);
}
