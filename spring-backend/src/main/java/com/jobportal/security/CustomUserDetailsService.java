package com.jobportal.security;

import com.jobportal.entity.Admin;
import com.jobportal.entity.User;
import com.jobportal.repository.AdminRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * CustomUserDetailsService implements Spring Security's UserDetailsService.
 * It looks up both User and Admin tables by email (username), and builds
 * a CustomUserDetails principal from whichever is found.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Check user table first
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return CustomUserDetails.fromUser(user.get());
        }

        // Fallback to admin table
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return CustomUserDetails.fromAdmin(admin.get());
        }

        throw new UsernameNotFoundException("No user or admin found with email: " + email);
    }
}