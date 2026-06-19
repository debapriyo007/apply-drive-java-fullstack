package com.jobportal.service.impl;

import com.jobportal.dto.request.UserProfileDto;
import com.jobportal.entity.JobStatus;
import com.jobportal.entity.User;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.mapper.DtoMapper;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SavedJobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.repository.RefreshTokenRepository;
import java.util.List;
import com.jobportal.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final SavedJobRepository savedJobRepository;
    private final CompanyRepository companyRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final DtoMapper dtoMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<UserProfileDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(dtoMapper::toUserProfileDto);
    }

    @Override
    @Transactional
    public void changeUserStatus(Long userId, boolean isActive) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setIsActive(isActive);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        savedJobRepository.deleteAll(savedJobRepository.findByUserId(userId));
        refreshTokenRepository.deleteByUserId(userId);
        userRepository.deleteById(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAnalyticsSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalUsers", userRepository.count());
        summary.put("totalJobs", jobRepository.count());
        summary.put("totalCompanies", companyRepository.count());
        summary.put("activeJobs", jobRepository.countByStatus(JobStatus.ACTIVE));
        summary.put("draftJobs", jobRepository.countByStatus(JobStatus.DRAFT));
        summary.put("closedJobs", jobRepository.countByStatus(JobStatus.CLOSED));
        summary.put("totalSavedJobs", savedJobRepository.count());

        List<Map<String, Object>> popularCompanies = jobRepository.findPopularCompanies().stream()
                .limit(5)
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("companyName", row[0]);
                    map.put("jobCount", row[1]);
                    return map;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> mostSavedJobs = savedJobRepository.findMostSavedJobs().stream()
                .limit(5)
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("title", row[1]);
                    map.put("count", row[2]);
                    return map;
                })
                .collect(Collectors.toList());

        summary.put("popularCompanies", popularCompanies);
        summary.put("mostSavedJobs", mostSavedJobs);

        List<Map<String, Object>> registrationTrend = userRepository.getRegistrationStats().stream()
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("date", row[0] != null ? row[0].toString() : "");
                    map.put("count", row[1]);
                    return map;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> postingTrend = jobRepository.getJobPostingStats().stream()
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("date", row[0] != null ? row[0].toString() : "");
                    map.put("count", row[1]);
                    return map;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> jobsByCategory = jobRepository.findJobsCountByCategory().stream()
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("category", row[0] != null ? row[0].toString() : "");
                    map.put("count", row[1]);
                    return map;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> jobsByExperience = jobRepository.findJobsCountByExperience().stream()
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("experience", row[0] != null ? row[0].toString() : "Not Specified");
                    map.put("count", row[1]);
                    return map;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> jobsByJobType = jobRepository.findJobsCountByJobType().stream()
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("jobType", row[0] != null ? row[0].toString() : "");
                    map.put("count", row[1]);
                    return map;
                })
                .collect(Collectors.toList());

        summary.put("registrationTrend", registrationTrend);
        summary.put("postingTrend", postingTrend);
        summary.put("jobsByCategory", jobsByCategory);
        summary.put("jobsByExperience", jobsByExperience);
        summary.put("jobsByJobType", jobsByJobType);

        return summary;
    }
}