package com.jobportal.service;

import com.jobportal.dto.request.LoginRequest;
import com.jobportal.dto.request.UserRegisterRequest;
import com.jobportal.dto.response.TokenResponse;

public interface AuthService {
    void register(UserRegisterRequest request);
    TokenResponse login(LoginRequest request);
    TokenResponse adminLogin(LoginRequest request);
    String refreshUserToken(String refreshToken);
    String refreshAdminToken(String refreshToken);
    void logout(String refreshToken);
}
