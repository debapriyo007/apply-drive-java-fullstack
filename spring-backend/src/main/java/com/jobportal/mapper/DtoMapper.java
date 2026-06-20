package com.jobportal.mapper;

import com.jobportal.entity.*;
import com.jobportal.dto.category.CategoryDto;
import com.jobportal.dto.company.CompanyDto;
import com.jobportal.dto.user.UserProfileDto;
import com.jobportal.dto.job.JobResponse;
import com.jobportal.entity.Category;
import com.jobportal.entity.Company;
import com.jobportal.entity.User;
import com.jobportal.entity.Role;
import com.jobportal.entity.Job;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

/**
 * DtoMapper — centralizes all entity ↔ DTO conversions.
 *
 * WHY USE ModelMapper here?
 * -------------------------
 * Simple field-to-field mappings (same field names) are delegated to ModelMapper
 * to avoid repetitive boilerplate. Complex custom mappings (e.g., nested entity
 * to DTO conversion) are implemented manually for type safety and clarity.
 *
 * This class is a @Component (not a @Service) because it contains no business
 * logic — it is a pure infrastructure utility.
 */
@Component
@RequiredArgsConstructor
public class DtoMapper {

    private final ModelMapper modelMapper;

    // ─── Category ────────────────────────────────────────────────────────────

    public CategoryDto toCategoryDto(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .build();
    }

    public Category toCategory(CategoryDto dto) {
        return Category.builder()
                .name(dto.getName())
                .slug(dto.getSlug() != null ? dto.getSlug() : dto.getName().toLowerCase().replace(" ", "-"))
                .build();
    }

    // ─── Company ─────────────────────────────────────────────────────────────

    public CompanyDto toCompanyDto(Company company) {
        return CompanyDto.builder()
                .id(company.getId())
                .name(company.getName())
                .logoUrl(company.getLogoUrl())
                .websiteUrl(company.getWebsiteUrl())
                .description(company.getDescription())
                .build();
    }

    public Company toCompany(CompanyDto dto) {
        return Company.builder()
                .name(dto.getName())
                .logoUrl(dto.getLogoUrl())
                .websiteUrl(dto.getWebsiteUrl())
                .description(dto.getDescription())
                .build();
    }

    // ─── User ─────────────────────────────────────────────────────────────────

    public UserProfileDto toUserProfileDto(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .mobileNumber(user.getMobileNumber())
                .college(user.getCollege())
                .degree(user.getDegree())
                .branch(user.getBranch())
                .graduationYear(user.getGraduationYear())
                .skills(user.getSkills())
                .linkedinUrl(user.getLinkedinUrl())
                .githubUrl(user.getGithubUrl())
                .portfolioUrl(user.getPortfolioUrl())
                .profileImageUrl(user.getProfileImageUrl())
                .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .build();
    }

    // ─── Job ─────────────────────────────────────────────────────────────────

    public JobResponse toJobResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .company(toCompanyDto(job.getCompany()))
                .description(job.getDescription())
                .salary(job.getSalary())
                .experience(job.getExperience())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .officialApplyUrl(job.getOfficialApplyUrl())
                .deadline(job.getDeadline())
                .postedDate(job.getPostedDate())
                .status(job.getStatus())
                .categories(job.getCategories().stream().map(this::toCategoryDto).collect(Collectors.toSet()))
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}