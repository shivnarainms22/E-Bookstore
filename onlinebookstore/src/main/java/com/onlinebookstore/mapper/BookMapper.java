package com.onlinebookstore.mapper;

import org.springframework.stereotype.Component;

import com.onlinebookstore.dto.BookDTO;
import com.onlinebookstore.entity.Book;

@Component
public class BookMapper {

    public BookDTO toDTO(Book book) {
        if (book == null) {
            return null;
        }

        BookDTO bookDTO = new BookDTO();
        bookDTO.setId(book.getId());
        bookDTO.setTitle(book.getTitle());
        bookDTO.setAuthor(book.getAuthor());
        bookDTO.setPrice(book.getPrice());
        bookDTO.setImageUrl(book.getImageUrl());

        if (book.getCategory() != null) {
            bookDTO.setCategoryId(book.getCategory().getId());
            bookDTO.setCategoryName(book.getCategory().getName());
        }

        return bookDTO;
    }
}
