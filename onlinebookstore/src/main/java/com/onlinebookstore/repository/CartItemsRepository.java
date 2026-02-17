package com.onlinebookstore.repository;

import com.onlinebookstore.entity.CartItems;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface CartItemsRepository extends JpaRepository<CartItems, Long> {
	
	Optional<CartItems> findByUserIdAndBookIdAndOrderId(Long userId, Long bookId, Long orderId);
	
}
