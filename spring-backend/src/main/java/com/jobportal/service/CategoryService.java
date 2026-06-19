package com.jobportal.service;

import com.jobportal.dto.request.CategoryDto;

import java.util.List;

public interface CategoryService {
    List<CategoryDto> getAllCategories();
    CategoryDto getCategoryById(Long id);
    CategoryDto createCategory(CategoryDto dto);
    void deleteCategory(Long id);
}
