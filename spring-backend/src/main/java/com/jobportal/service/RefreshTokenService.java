package com.jobportal.service;

import com.jobportal.entity.RefreshToken;

import java.util.Optional;

public interface RefreshTokenService {
    Optional<RefreshToken> findByToken(String token);
    RefreshToken createRefreshTokenForUser(Long userId);
    RefreshToken createRefreshTokenForAdmin(Long adminId);
    RefreshToken verifyExpiration(RefreshToken token);
    int deleteByUserId(Long userId);
    int deleteByAdminId(Long adminId);
}
