package com.jobportal.service.job;

import com.jobportal.entity.*;
import com.jobportal.dto.job.JobCreateRequest;
import com.jobportal.dto.job.JobEvent;
import com.jobportal.dto.job.JobResponse;
import com.jobportal.entity.Job;
import com.jobportal.entity.JobStatus;
import com.jobportal.entity.Category;
import com.jobportal.entity.Company;
import com.jobportal.entity.Admin;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.mapper.DtoMapper;
import com.jobportal.repository.AdminRepository;
import com.jobportal.repository.CategoryRepository;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SavedJobRepository;
import com.jobportal.service.job.JobService;
import com.jobportal.service.infrastructure.RealTimeSyncService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private static final Logger log = LoggerFactory.getLogger(JobServiceImpl.class);

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final CategoryRepository categoryRepository;
    private final SavedJobRepository savedJobRepository;
    private final AdminRepository adminRepository;
    private final RealTimeSyncService syncService;
    private final DtoMapper dtoMapper;

    @Override
    @Transactional
    public JobResponse createJob(JobCreateRequest request, Long adminId) {
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + request.getCompanyId()));
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + adminId));

        Set<Category> categories = new HashSet<>(categoryRepository.findAllById(request.getCategoryIds()));

        Job job = Job.builder()
                .title(request.getTitle())
                .company(company)
                .description(request.getDescription())
                .salary(request.getSalary())
                .experience(request.getExperience())
                .location(request.getLocation())
                .jobType(request.getJobType())
                .officialApplyUrl(request.getOfficialApplyUrl())
                .deadline(request.getDeadline())
                .postedDate(LocalDate.now())
                .status(JobStatus.DRAFT)
                .createdBy(admin)
                .categories(categories)
                .build();

        Job saved = jobRepository.save(job);
        syncService.publishJobEvent(new JobEvent("JOB_CREATED", saved.getId(), saved.getTitle()));
        return dtoMapper.toJobResponse(saved);
    }

    @Override
    @Transactional
    public JobResponse updateJob(Long id, JobCreateRequest request) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + request.getCompanyId()));

        job.setTitle(request.getTitle());
        job.setCompany(company);
        job.setDescription(request.getDescription());
        job.setSalary(request.getSalary());
        job.setExperience(request.getExperience());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setOfficialApplyUrl(request.getOfficialApplyUrl());
        job.setDeadline(request.getDeadline());
        job.setCategories(new HashSet<>(categoryRepository.findAllById(request.getCategoryIds())));

        return dtoMapper.toJobResponse(jobRepository.save(job));
    }

    @Override
    @Transactional
    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job not found with id: " + id);
        }
        savedJobRepository.deleteByJobId(id);
        jobRepository.deleteById(id);
    }

    @Override
    @Transactional
    public JobResponse cloneJob(Long id) {
        Job original = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        Job clone = Job.builder()
                .title("[COPY] " + original.getTitle())
                .company(original.getCompany())
                .description(original.getDescription())
                .salary(original.getSalary())
                .experience(original.getExperience())
                .location(original.getLocation())
                .jobType(original.getJobType())
                .officialApplyUrl(original.getOfficialApplyUrl())
                .deadline(original.getDeadline())
                .postedDate(LocalDate.now())
                .status(JobStatus.DRAFT)
                .createdBy(original.getCreatedBy())
                .categories(new HashSet<>(original.getCategories()))
                .build();
        return dtoMapper.toJobResponse(jobRepository.save(clone));
    }

    @Override
    @Transactional
    public JobResponse changeStatus(Long id, String status) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        job.setStatus(JobStatus.valueOf(status.toUpperCase()));
        return dtoMapper.toJobResponse(jobRepository.save(job));
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        return dtoMapper.toJobResponse(job);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponse> searchJobs(String title, String location, String jobType, Long categoryId, Pageable pageable) {
        Specification<Job> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("status"), JobStatus.ACTIVE));
            if (title != null && !title.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
            }
            if (location != null && !location.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
            }
            if (jobType != null && !jobType.isBlank()) {
                predicates.add(cb.equal(root.get("jobType"), jobType));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.join("categories").get("id"), categoryId));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return jobRepository.findAll(spec, pageable).map(dtoMapper::toJobResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponse> searchJobsForAdmin(String title, String status, Pageable pageable) {
        Specification<Job> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (title != null && !title.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
            }
            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("status"), JobStatus.valueOf(status.toUpperCase())));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return jobRepository.findAll(spec, pageable).map(dtoMapper::toJobResponse);
    }
}