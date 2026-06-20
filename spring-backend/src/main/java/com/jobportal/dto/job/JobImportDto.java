package com.jobportal.dto.job;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobImportDto {

    private String companyName;
    private String jobTitle;
    private String salary;
    private String location;
    private String applyLink;
    private String rawPostText;
}