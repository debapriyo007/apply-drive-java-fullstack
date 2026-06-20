package com.jobportal.repository;

import com.jobportal.entity.ForgotPasswordOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ForgotPasswordOtpRepository extends JpaRepository<ForgotPasswordOtp, Long> {
    Optional<ForgotPasswordOtp> findByEmail(String email);
    void deleteByEmail(String email);
}
