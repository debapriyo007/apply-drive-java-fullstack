package com.jobportal.dto.request;

import lombok.*;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyDto {

    private Long id;

    @NotBlank(message = "Company name is required")
    private String name;

    private String logoUrl;
    private String websiteUrl;
    private String description;
}