package com.onlinebookstore.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.onlinebookstore.dto.BookDTO;
import com.onlinebookstore.dto.CategoryDTO;
import com.onlinebookstore.dto.OrderDTO;
import com.onlinebookstore.entity.Book;
import com.onlinebookstore.entity.Category;
import com.onlinebookstore.entity.Order;
import com.onlinebookstore.enums.OrderStatus;
import com.onlinebookstore.exception.BookNotFoundException;
import com.onlinebookstore.repository.BookRepository;
import com.onlinebookstore.repository.CategoryRepository;
import com.onlinebookstore.repository.OrderRepository;
import com.onlinebookstore.mapper.BookMapper;
import com.onlinebookstore.mapper.CategoryMapper;
import com.onlinebookstore.mapper.OrderMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {
	private final CategoryRepository categoryRepository;
	private final BookRepository bookRepository;
	private final OrderRepository orderRepository;
	private final BookMapper bookMapper;
	private final CategoryMapper categoryMapper;
	private final OrderMapper orderMapper;
	
	@Override
	public Category createdCategory(CategoryDTO categoryDTO) {
		log.info("Creating new category: {}", categoryDTO.getName());
		Category category=new Category();
		category.setName(categoryDTO.getName());
		category.setDescription(categoryDTO.getDescription());
		Category savedCategory = categoryRepository.save(category);
		log.info("Category created successfully with ID: {}", savedCategory.getId());
		return savedCategory;
	}
	
	@Override
	@Transactional(readOnly = true)
	public List<CategoryDTO> getAllCategories()
	{
		return categoryRepository.findAll().stream().map(categoryMapper::toDTO).collect(Collectors.toList());
	}
	
	@Override
	public Book postBook(Long categoryId,BookDTO bookDTO) {
		log.info("Creating new book: {} for category ID: {}", bookDTO.getTitle(), categoryId);
		Optional<Category> optionalCategory=categoryRepository.findById(categoryId);
		if(optionalCategory.isPresent()) {
			Book book=new Book();
			book.setTitle(bookDTO.getTitle());
			book.setPrice(bookDTO.getPrice());
			book.setAuthor(bookDTO.getAuthor());
			book.setImageUrl(bookDTO.getImageUrl());
			book.setCategory(optionalCategory.get());
			Book savedBook = bookRepository.save(book);
			log.info("Book created successfully with ID: {}", savedBook.getId());
			return savedBook;
		}
		log.warn("Category not found with ID: {}", categoryId);
		return null;
	}
	
	@Override
	@Transactional(readOnly = true)
	public List<BookDTO> getAllBooks(){
		return bookRepository.findAll().stream().map(bookMapper::toDTO).collect(Collectors.toList());
	}
	
	@Override
	public void deletebook(Long id) {
		log.info("Deleting book with ID: {}", id);
		Optional<Book> optionalBook=bookRepository.findById(id);
		if(optionalBook.isEmpty()) {
			log.error("Book not found with ID: {}", id);
			throw new BookNotFoundException("Book not found");
		}
		bookRepository.deleteById(id);
		log.info("Book deleted successfully with ID: {}", id);
	}
	
	@Override
	@Transactional(readOnly = true)
	public BookDTO getBookById(Long id) {
		Optional<Book> optionalBook=bookRepository.findById(id);
		if(optionalBook.isPresent())
		{
			return bookMapper.toDTO(optionalBook.get());
		}
		return null;
	}
	
	@Override
	public BookDTO UpdateBook(Long categoryId,Long bookId,BookDTO bookDTO) {
		log.info("Updating book ID: {} with category ID: {}", bookId, categoryId);
		Optional<Category> optionalCategory=categoryRepository.findById(categoryId);
		Optional<Book> optionalBook=bookRepository.findById(bookId);
		if(optionalCategory.isPresent() && optionalBook.isPresent())
		{
			Book book=optionalBook.get();
			book.setTitle(bookDTO.getTitle());
			book.setAuthor(bookDTO.getAuthor());
			book.setPrice(bookDTO.getPrice());
			book.setImageUrl(bookDTO.getImageUrl());
			book.setCategory(optionalCategory.get());
			Book updatedBook=bookRepository.save(book);
			log.info("Book updated successfully with ID: {}", bookId);
	        return bookMapper.toDTO(updatedBook);
		}
		log.warn("Book or category not found. Book ID: {}, Category ID: {}", bookId, categoryId);
		return null;
	}
	
	@Override
	@Transactional(readOnly = true)
	public List<OrderDTO> getAllOrders() {
		return orderRepository.findAllByOrderStatus(OrderStatus.SUBMITTED).stream().map(orderMapper::toDTO).collect(Collectors.toList());
	}
	
	@Override
	public void deleteCategory(Long categoryId) {
	    Optional<Category> optionalCategory = categoryRepository.findById(categoryId);
	    if (optionalCategory.isEmpty()) {
	        throw new RuntimeException("Category not found");
	    }
	    categoryRepository.deleteById(categoryId);
	}

}
