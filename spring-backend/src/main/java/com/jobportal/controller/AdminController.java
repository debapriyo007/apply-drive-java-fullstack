package com.jobportal.controller;

import com.jobportal.dto.request.CategoryDto;
import com.jobportal.dto.request.CompanyDto;
import com.jobportal.dto.request.JobCreateRequest;
import com.jobportal.dto.request.UserProfileDto;
import com.jobportal.dto.response.JobImportDto;
import com.jobportal.dto.response.JobResponse;
import com.jobportal.security.CustomUserDetails;
import com.jobportal.service.AdminService;
import com.jobportal.service.CategoryService;
import com.jobportal.service.CompanyService;
import com.jobportal.service.JobImporterService;
import com.jobportal.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final JobService jobService;
    private final CompanyService companyService;
    private final CategoryService categoryService;
    private final JobImporterService jobImporterService;

    // ─── Dashboard ────────────────────────────────────────────────────────────

    @GetMapping("/dashboard/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalyticsSummary());
    }

    // ─── User Management ─────────────────────────────────────────────────────

    @GetMapping("/users")
    public ResponseEntity<Page<UserProfileDto>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(adminService.getAllUsers(pageable));
    }

    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<?> changeUserStatus(@PathVariable Long userId, @RequestParam boolean isActive) {
        adminService.changeUserStatus(userId, isActive);
        return ResponseEntity.ok(Map.of("message", "User status updated."));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok(Map.of("message", "User deleted."));
    }

    // ─── Job Management ──────────────────────────────────────────────────────

    @PostMapping("/jobs")
    public ResponseEntity<JobResponse> createJob(
            @Valid @RequestBody JobCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(jobService.createJob(request, principal.getId()));
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<JobResponse> updateJob(@PathVariable Long id, @Valid @RequestBody JobCreateRequest request) {
        return ResponseEntity.ok(jobService.updateJob(id, request));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(Map.of("message", "Job deleted."));
    }

    @PostMapping("/jobs/{id}/clone")
    public ResponseEntity<JobResponse> cloneJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.cloneJob(id));
    }

    @PatchMapping("/jobs/{id}/status")
    public ResponseEntity<JobResponse> changeJobStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(jobService.changeStatus(id, status));
    }

    @GetMapping("/jobs")
    public ResponseEntity<Page<JobResponse>> getAdminJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(jobService.searchJobsForAdmin(title, status, pageable));
    }

    @PostMapping("/jobs/import/parse")
    public ResponseEntity<JobImportDto> parseJobPost(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(jobImporterService.parseJobPost(body.get("text")));
    }

    // ─── Company Management ──────────────────────────────────────────────────

    @PostMapping("/companies")
    public ResponseEntity<CompanyDto> createCompany(@Valid @RequestBody CompanyDto dto) {
        return ResponseEntity.ok(companyService.createCompany(dto));
    }

    @PutMapping("/companies/{id}")
    public ResponseEntity<CompanyDto> updateCompany(@PathVariable Long id, @Valid @RequestBody CompanyDto dto) {
        return ResponseEntity.ok(companyService.updateCompany(id, dto));
    }

    @DeleteMapping("/companies/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable Long id) {
        companyService.deleteCompany(id);
        return ResponseEntity.ok(Map.of("message", "Company deleted."));
    }

    // ─── Category Management ─────────────────────────────────────────────────

    @PostMapping("/categories")
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CategoryDto dto) {
        return ResponseEntity.ok(categoryService.createCategory(dto));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(Map.of("message", "Category deleted."));
    }
}