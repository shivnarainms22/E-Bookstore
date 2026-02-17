package com.onlinebookstore.testservice;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.onlinebookstore.dto.BookDTO;
import com.onlinebookstore.dto.CategoryDTO;
import com.onlinebookstore.dto.OrderDTO;
import com.onlinebookstore.entity.Book;
import com.onlinebookstore.entity.Category;
import com.onlinebookstore.entity.Order;
import com.onlinebookstore.enums.OrderStatus;
import com.onlinebookstore.repository.BookRepository;
import com.onlinebookstore.repository.CategoryRepository;
import com.onlinebookstore.repository.OrderRepository;
import com.onlinebookstore.service.AdminServiceImpl;

class TestAdminServiceImpl {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private BookRepository bookRepository;

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private AdminServiceImpl adminService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreatedCategory() {
        CategoryDTO categoryDTO = new CategoryDTO();
        categoryDTO.setName("Fiction");
        categoryDTO.setDescription("Fictional Books");

        Category category = new Category();
        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());

        when(categoryRepository.save(any(Category.class))).thenReturn(category);

        Category result = adminService.createdCategory(categoryDTO);

        assertNotNull(result);
        assertEquals("Fiction", result.getName());
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void testGetAllCategories() {
        List<Category> categories = new ArrayList<>();
        Category category = new Category();
        category.setName("Fiction");
        categories.add(category);

        when(categoryRepository.findAll()).thenReturn(categories);

        List<CategoryDTO> result = adminService.getAllCategories();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(categoryRepository, times(1)).findAll();
    }

    @Test
    void testPostBook() {
        Long categoryId = 1L;
        BookDTO bookDTO = new BookDTO();
        bookDTO.setTitle("Book Title");
        bookDTO.setPrice(100);
        bookDTO.setAuthor("Author");

        Category category = new Category();
        category.setId(categoryId);

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> {
            Book book = invocation.getArgument(0);
            book.setId(1L);
            return book;
        });

        Book result = adminService.postBook(categoryId, bookDTO);

        assertNotNull(result);
        assertEquals("Book Title", result.getTitle());
        verify(categoryRepository, times(1)).findById(categoryId);
        verify(bookRepository, times(1)).save(any(Book.class));
    }

    @Test
    void testDeleteBook() {
        Long bookId = 1L;
        Book book = new Book();
        book.setId(bookId);

        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));

        adminService.deletebook(bookId);

        verify(bookRepository, times(1)).findById(bookId);
        verify(bookRepository, times(1)).deleteById(bookId);
    }

    @Test
    void testGetBookById() {
    	 Long bookId = 1L;
    	    Book book = mock(Book.class);

    	    BookDTO bookDTO = new BookDTO();
    	    bookDTO.setId(bookId);
    	    bookDTO.setTitle("Book Title");

    	    when(book.getBookDTO()).thenReturn(bookDTO);
    	    when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));

    	    BookDTO result = adminService.getBookById(bookId);

    	    assertNotNull(result);
    	    assertEquals(bookId, result.getId());
    	    assertEquals("Book Title", result.getTitle());
    	    verify(bookRepository, times(1)).findById(bookId);
    	    verify(book, times(1)).getBookDTO();
    }

    @Test
    void testGetAllBooks() {

    	    List<Book> books = new ArrayList<>();
    	    Book book = mock(Book.class);
    	    books.add(book);

    	    BookDTO bookDTO = new BookDTO();
    	    bookDTO.setTitle("Book Title");

    	    when(book.getBookDTO()).thenReturn(bookDTO);
    	    when(bookRepository.findAll()).thenReturn(books);

    	    List<BookDTO> result = adminService.getAllBooks();

    	    assertNotNull(result);
    	    assertEquals(1, result.size());
    	    assertEquals("Book Title", result.get(0).getTitle());
    	    verify(bookRepository, times(1)).findAll();
    	    verify(book, times(1)).getBookDTO();
    	}

    @Test
    void testGetAllOrders() {
    	 List<Order> orders = new ArrayList<>();
    	    Order order = mock(Order.class);
    	    orders.add(order);

    	    OrderDTO orderDTO = new OrderDTO();
    	    orderDTO.setId(1L);

    	    when(order.getOrderDTO()).thenReturn(orderDTO);
    	    when(orderRepository.findAllByOrderStatus(OrderStatus.SUBMITTED)).thenReturn(orders);

    	    List<OrderDTO> result = adminService.getAllOrders();

    	    assertNotNull(result);
    	    assertEquals(1, result.size());
    	    assertEquals(1L, result.get(0).getId());
    	    verify(orderRepository, times(1)).findAllByOrderStatus(OrderStatus.SUBMITTED);
    	    verify(order, times(1)).getOrderDTO();
    }
}