package com.jobportal.dto.request;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDto {

    private Long id;
    private String email;
    private String fullName;
    private String mobileNumber;
    private String college;
    private String degree;
    private String branch;
    private Integer graduationYear;
    private String skills;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String profileImageUrl;
    private Set<String> roles;
}