package com.jobportal.controller;

import com.jobportal.dto.request.UserProfileDto;
import com.jobportal.dto.response.JobResponse;
import com.jobportal.security.CustomUserDetails;
import com.jobportal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getProfile(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(userService.getUserProfile(principal.getId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestBody UserProfileDto dto) {
        return ResponseEntity.ok(userService.updateUserProfile(principal.getId(), dto));
    }

    @PatchMapping("/profile/image")
    public ResponseEntity<UserProfileDto> uploadProfileImage(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(userService.uploadProfileImage(principal.getId(), body.get("imageUrl")));
    }

    @PostMapping("/saved-jobs/{jobId}")
    public ResponseEntity<?> saveJob(@AuthenticationPrincipal CustomUserDetails principal, @PathVariable Long jobId) {
        userService.saveJob(principal.getId(), jobId);
        return ResponseEntity.ok(Map.of("message", "Job saved."));
    }

    @DeleteMapping("/saved-jobs/{jobId}")
    public ResponseEntity<?> unsaveJob(@AuthenticationPrincipal CustomUserDetails principal, @PathVariable Long jobId) {
        userService.unsaveJob(principal.getId(), jobId);
        return ResponseEntity.ok(Map.of("message", "Job unsaved."));
    }

    @GetMapping("/saved-jobs")
    public ResponseEntity<List<JobResponse>> getSavedJobs(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(userService.getSavedJobs(principal.getId()));
    }

    @GetMapping("/saved-jobs/{jobId}/check")
    public ResponseEntity<Map<String, Boolean>> isJobSaved(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PathVariable Long jobId) {
        boolean saved = userService.isJobSaved(principal.getId(), jobId);
        return ResponseEntity.ok(Map.of("saved", saved));
    }
}