package com.onlinebookstore.entity;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.onlinebookstore.dto.BookDTO;

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
@Table(name="Books")
@Data
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String author;

    private Integer price;
    
    private String imageUrl;

    
    @ManyToOne(fetch=FetchType.LAZY,optional=false)
    @JoinColumn(name="category_id",nullable=false)
    @OnDelete(action=OnDeleteAction.CASCADE)
    @JsonIgnore
    private Category category;
    
    public BookDTO getBookDTO()
    {
    	BookDTO bookDTO=new BookDTO();
    	bookDTO.setId(id);
    	bookDTO.setTitle(title);
    	bookDTO.setAuthor(author);
    	bookDTO.setPrice(price);
    	bookDTO.setImageUrl(imageUrl);
    	bookDTO.setCategoryId(category.getId());
    	bookDTO.setCategoryName(category.getName());
    	return bookDTO;
    	
    }
    
		

}
