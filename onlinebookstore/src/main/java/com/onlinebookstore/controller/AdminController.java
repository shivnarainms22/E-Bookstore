package com.onlinebookstore.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.onlinebookstore.dto.BookDTO;
import com.onlinebookstore.dto.CategoryDTO;
import com.onlinebookstore.dto.OrderDTO;
import com.onlinebookstore.entity.Book;
import com.onlinebookstore.entity.Category;
import com.onlinebookstore.service.AdminService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@Validated
@RequiredArgsConstructor
public class AdminController {
	private final AdminService adminService;
	
	@PostMapping("/category")
	public ResponseEntity<Category> createCategory(@Valid @RequestBody CategoryDTO categoryDTO)
	{
		Category createdcategory=adminService.createdCategory(categoryDTO);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdcategory);
	}
	
	@GetMapping("/categories")
	public ResponseEntity<List<CategoryDTO>> getAllCategories()
	{
		List<CategoryDTO> allCategories=adminService.getAllCategories();
		return ResponseEntity.ok(allCategories);
	}
	
	@PostMapping("/book/{categoryId}")
	public ResponseEntity<Book> postBook(@PathVariable @NotNull Long categoryId, @Valid @RequestBody BookDTO bookDTO){
		Book postedBook=adminService.postBook(categoryId, bookDTO);
		return ResponseEntity.status(HttpStatus.CREATED).body(postedBook);
	}
	
	@GetMapping("/books")
	public ResponseEntity<List<BookDTO>> getAllBooks()
	{
		List<BookDTO> bookDtoList=adminService.getAllBooks();
		return ResponseEntity.ok(bookDtoList);
	}
	
	@DeleteMapping("/book/{id}")
	public ResponseEntity<Void> deleteBook(@PathVariable Long id)
	{
		adminService.deletebook(id);
		return ResponseEntity.noContent().build();
	}
	
	@GetMapping("/book/{id}")
	public ResponseEntity<?> getBookById(@PathVariable Long id)
	{
		BookDTO bookDTO=adminService.getBookById(id);
		if(bookDTO==null)
		{
			//return ResponseEntity.notFound().build();
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book id is not available");
		}
		return ResponseEntity.ok(bookDTO);
	}
	
	@PutMapping("/{categoryId}/book/{bookId}")
	public ResponseEntity<?> updateBook(@PathVariable @NotNull Long categoryId, @PathVariable @NotNull Long bookId, @Valid @RequestBody BookDTO bookDTO)
	{
		BookDTO updateBook=adminService.UpdateBook(categoryId, bookId, bookDTO);
		if(updateBook==null)
		{
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Something Went Wrong");
		}
		return ResponseEntity.ok(updateBook);
	}
	
	@GetMapping("/orders")
	public ResponseEntity<List<OrderDTO>> getAllOrders()
	{
		List<OrderDTO> orderDTOList=adminService.getAllOrders();
		return ResponseEntity.ok(orderDTOList);
	}
	
	@DeleteMapping("/category/{id}")
	public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
	    adminService.deleteCategory(id);
	    return ResponseEntity.noContent().build();
	}

}