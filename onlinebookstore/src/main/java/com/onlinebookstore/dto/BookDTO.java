package com.onlinebookstore.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BookDTO {
	private Long id;

	@NotBlank(message = "Title is required")
	@Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
	private String title;

	@NotBlank(message = "Author is required")
	@Size(min = 1, max = 255, message = "Author must be between 1 and 255 characters")
	private String author;

	@NotNull(message = "Price is required")
	@Min(value = 0, message = "Price must be greater than or equal to 0")
	private Integer price;

	@Size(max = 500, message = "Image URL must not exceed 500 characters")
	private String imageUrl;

	@NotNull(message = "Category ID is required")
	private Long categoryId;

	private String categoryName;
}
