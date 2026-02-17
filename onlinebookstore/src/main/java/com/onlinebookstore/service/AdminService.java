package com.onlinebookstore.service;

import java.util.List;

import com.onlinebookstore.dto.BookDTO;
import com.onlinebookstore.dto.CategoryDTO;
import com.onlinebookstore.dto.OrderDTO;
import com.onlinebookstore.entity.Book;
import com.onlinebookstore.entity.Category;

public interface AdminService {
	Category createdCategory(CategoryDTO categoryDTO);
	List<CategoryDTO> getAllCategories();
	Book postBook(Long categoryId, BookDTO bookDTO);
	List<BookDTO> getAllBooks();
	void deletebook(Long id);
	BookDTO getBookById(Long id);
	BookDTO UpdateBook(Long categoryId,Long bookId,BookDTO bookDTO);
	List<OrderDTO> getAllOrders();
	void deleteCategory(Long categoryId);

}
