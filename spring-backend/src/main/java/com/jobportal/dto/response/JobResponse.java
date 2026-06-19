package com.jobportal.dto.response;

import com.jobportal.dto.request.CategoryDto;
import com.jobportal.dto.request.CompanyDto;
import com.jobportal.entity.JobStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponse {

    private Long id;
    private String title;
    private CompanyDto company;
    private String description;
    private String salary;
    private String experience;
    private String location;
    private String jobType;
    private String officialApplyUrl;
    private LocalDate deadline;
    private LocalDate postedDate;
    private JobStatus status;
    private Set<CategoryDto> categories;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}