package com.jobportal.repository;

import com.jobportal.entity.Admin;
import com.jobportal.entity.RefreshToken;
import com.jobportal.entity.User;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUserId(Long userId);
    Optional<RefreshToken> findByAdminId(Long adminId);
    
    @Modifying
    int deleteByUserId(Long userId);
    
    @Modifying
    int deleteByAdminId(Long adminId);
}
