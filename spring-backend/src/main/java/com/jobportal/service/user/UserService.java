package com.jobportal.service.user;

import com.jobportal.dto.user.UserProfileDto;
import com.jobportal.dto.job.JobResponse;


import com.jobportal.dto.user.ChangePasswordRequest;
import java.util.List;

public interface UserService {
    UserProfileDto getUserProfile(Long userId);
    UserProfileDto updateUserProfile(Long userId, UserProfileDto dto);
    UserProfileDto uploadProfileImage(Long userId, String imageUrl);
    void saveJob(Long userId, Long jobId);
    void unsaveJob(Long userId, Long jobId);
    List<JobResponse> getSavedJobs(Long userId);
    boolean isJobSaved(Long userId, Long jobId);
    void changePassword(Long userId, ChangePasswordRequest request);
}
