package com.onlinebookstore.mapper;

import org.springframework.stereotype.Component;

import com.onlinebookstore.dto.CategoryDTO;
import com.onlinebookstore.entity.Category;

@Component
public class CategoryMapper {

    public CategoryDTO toDTO(Category category) {
        if (category == null) {
            return null;
        }

        CategoryDTO categoryDTO = new CategoryDTO();
        categoryDTO.setId(category.getId());
        categoryDTO.setName(category.getName());
        categoryDTO.setDescription(category.getDescription());

        return categoryDTO;
    }
}
