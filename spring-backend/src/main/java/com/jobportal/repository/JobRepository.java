package com.jobportal.repository;

import com.jobportal.entity.Job;
import com.jobportal.entity.JobStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    
    // For analytics dashboards
    long countByStatus(JobStatus status);

    @Query("SELECT j.company.name, COUNT(j) FROM Job j GROUP BY j.company.name ORDER BY COUNT(j) DESC")
    List<Object[]> findPopularCompanies();

    @Query("SELECT DATE(j.createdAt), COUNT(j) FROM Job j GROUP BY DATE(j.createdAt) ORDER BY DATE(j.createdAt) ASC")
    List<Object[]> getJobPostingStats();

    @Query("SELECT c.name, COUNT(j) FROM Job j JOIN j.categories c GROUP BY c.name ORDER BY COUNT(j) DESC")
    List<Object[]> findJobsCountByCategory();

    @Query("SELECT j.experience, COUNT(j) FROM Job j GROUP BY j.experience ORDER BY COUNT(j) DESC")
    List<Object[]> findJobsCountByExperience();

    @Query("SELECT j.jobType, COUNT(j) FROM Job j GROUP BY j.jobType ORDER BY COUNT(j) DESC")
    List<Object[]> findJobsCountByJobType();

    List<Job> findByCompanyId(Long companyId);

    boolean existsByTitle(String title);
    boolean existsByOfficialApplyUrl(String officialApplyUrl);
}

