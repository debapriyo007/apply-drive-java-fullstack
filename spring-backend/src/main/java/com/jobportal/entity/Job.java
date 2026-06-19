package com.jobportal.entity;

import lombok.*;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "jobs", indexes = {
    @Index(name = "idx_jobs_status_posted", columnList = "status, posted_date"),
    @Index(name = "idx_jobs_company_id", columnList = "company_id"),
    @Index(name = "idx_jobs_deadline", columnList = "deadline")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job extends BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(length = 50)
    private String salary;

    @Column(length = 50)
    private String experience;

    @Column(length = 100)
    private String location;

    @Column(name = "job_type", nullable = false, length = 20)
    private String jobType;

    @Column(name = "official_apply_url", nullable = false, length = 512)
    private String officialApplyUrl;

    @Column(name = "deadline")
    private LocalDate deadline;

    @Column(name = "posted_date", nullable = false)
    private LocalDate postedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private JobStatus status = JobStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Admin createdBy;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "job_categories",
        joinColumns = @JoinColumn(name = "job_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @Builder.Default
    private Set<Category> categories = new HashSet<>();
}