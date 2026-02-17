package com.onlinebookstore.entity;

import com.onlinebookstore.dto.CategoryDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="categories")
@Data
public class Category {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	private String name;
	@Lob
	private String description;
	
	public CategoryDTO getCategoryDTO()
	{
		CategoryDTO categoryDTO=new CategoryDTO();
		categoryDTO.setId(id);
		categoryDTO.setName(name);
		categoryDTO.setDescription(description);
		return categoryDTO;
	}
}
