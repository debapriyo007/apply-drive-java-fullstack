package com.jobportal.service;

import com.jobportal.dto.request.UserProfileDto;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Map;

public interface AdminService {
    Page<UserProfileDto> getAllUsers(Pageable pageable);
    void changeUserStatus(Long userId, boolean isActive);
    void deleteUser(Long userId);
    Map<String, Object> getAnalyticsSummary();
}
