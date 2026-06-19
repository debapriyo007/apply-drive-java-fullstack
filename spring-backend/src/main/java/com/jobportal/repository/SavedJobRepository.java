package com.jobportal.repository;

import com.jobportal.entity.SavedJob;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    
    Optional<SavedJob> findByUserIdAndJobId(Long userId, Long jobId);
    
    List<SavedJob> findByUserId(Long userId);
    
    boolean existsByUserIdAndJobId(Long userId, Long jobId);
    
    void deleteByUserIdAndJobId(Long userId, Long jobId);
    
    long countByJobId(Long jobId);

    @org.springframework.data.jpa.repository.Modifying
    void deleteByJobId(Long jobId);

    // For analytics dashboard: top saved jobs
    @Query("SELECT sj.job.id, sj.job.title, COUNT(sj) FROM SavedJob sj GROUP BY sj.job.id, sj.job.title ORDER BY COUNT(sj) DESC")
    List<Object[]> findMostSavedJobs();
}
