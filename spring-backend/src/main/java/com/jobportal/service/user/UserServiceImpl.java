package com.jobportal.service.user;

import com.jobportal.dto.user.UserProfileDto;
import com.jobportal.dto.user.ChangePasswordRequest;
import com.jobportal.entity.User;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.exception.BadRequestException;
import com.jobportal.mapper.DtoMapper;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SavedJobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.user.UserService;
import com.jobportal.entity.Job;
import com.jobportal.entity.SavedJob;
import com.jobportal.dto.job.JobResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final SavedJobRepository savedJobRepository;
    private final DtoMapper dtoMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return dtoMapper.toUserProfileDto(user);
    }

    @Override
    @Transactional
    public UserProfileDto updateUserProfile(Long userId, UserProfileDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setFullName(dto.getFullName());
        user.setMobileNumber(dto.getMobileNumber());
        user.setCollege(dto.getCollege());
        user.setDegree(dto.getDegree());
        user.setBranch(dto.getBranch());
        user.setGraduationYear(dto.getGraduationYear());
        user.setSkills(dto.getSkills());
        user.setLinkedinUrl(dto.getLinkedinUrl());
        user.setGithubUrl(dto.getGithubUrl());
        user.setPortfolioUrl(dto.getPortfolioUrl());
        user.setProfileImageUrl(dto.getProfileImageUrl());
        return dtoMapper.toUserProfileDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserProfileDto uploadProfileImage(Long userId, String imageUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setProfileImageUrl(imageUrl);
        return dtoMapper.toUserProfileDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public void saveJob(Long userId, Long jobId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));
        if (!savedJobRepository.existsByUserIdAndJobId(userId, jobId)) {
            savedJobRepository.save(SavedJob.builder().user(user).job(job).build());
        }
    }

    @Override
    @Transactional
    public void unsaveJob(Long userId, Long jobId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        if (!jobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job not found with id: " + jobId);
        }
        savedJobRepository.deleteByUserIdAndJobId(userId, jobId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getSavedJobs(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return savedJobRepository.findByUserId(userId).stream()
                .map(SavedJob::getJob)
                .map(dtoMapper::toJobResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isJobSaved(Long userId, Long jobId) {
        return savedJobRepository.existsByUserIdAndJobId(userId, jobId);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}