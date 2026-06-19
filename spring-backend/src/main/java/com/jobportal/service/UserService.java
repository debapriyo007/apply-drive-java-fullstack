package com.jobportal.service;

import com.jobportal.dto.request.UserProfileDto;
import com.jobportal.dto.response.JobResponse;


import java.util.List;

public interface UserService {
    UserProfileDto getUserProfile(Long userId);
    UserProfileDto updateUserProfile(Long userId, UserProfileDto dto);
    UserProfileDto uploadProfileImage(Long userId, String imageUrl);
    void saveJob(Long userId, Long jobId);
    void unsaveJob(Long userId, Long jobId);
    List<JobResponse> getSavedJobs(Long userId);
    boolean isJobSaved(Long userId, Long jobId);
}
