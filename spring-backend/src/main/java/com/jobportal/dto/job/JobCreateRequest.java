package com.jobportal.dto.job;

import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobCreateRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotNull(message = "Company ID is required")
    private Long companyId;

    @NotBlank(message = "Description is required")
    private String description;

    private String salary;
    private String experience;
    private String location;

    @NotBlank(message = "Job Type (REMOTE, HYBRID, ONSITE) is required")
    private String jobType;

    @NotBlank(message = "Official application URL is required")
    private String officialApplyUrl;

    private LocalDate deadline;

    @NotNull(message = "At least one category is required")
    private Set<Long> categoryIds;
}