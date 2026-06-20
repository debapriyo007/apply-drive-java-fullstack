package com.jobportal.service.job;

import com.jobportal.dto.category.CategoryDto;

import java.util.List;

public interface CategoryService {
    List<CategoryDto> getAllCategories();
    CategoryDto getCategoryById(Long id);
    CategoryDto createCategory(CategoryDto dto);
    void deleteCategory(Long id);
}
