package com.jobportal.service.job;

import com.jobportal.dto.job.JobCreateRequest;
import com.jobportal.dto.job.JobResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface JobService {
    JobResponse createJob(JobCreateRequest request, Long adminId);
    JobResponse updateJob(Long id, JobCreateRequest request);
    void deleteJob(Long id);
    JobResponse cloneJob(Long id);
    JobResponse changeStatus(Long id, String status);
    JobResponse getJobById(Long id);
    Page<JobResponse> searchJobs(String title, String location, String jobType, Long categoryId, Pageable pageable);
    Page<JobResponse> searchJobsForAdmin(String title, String status, Pageable pageable);
}
