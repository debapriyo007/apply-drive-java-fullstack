package com.jobportal.service.auth;

import com.jobportal.dto.auth.LoginRequest;
import com.jobportal.dto.user.UserRegisterRequest;
import com.jobportal.dto.auth.TokenResponse;

import com.jobportal.dto.auth.OtpVerificationRequest;
import com.jobportal.dto.auth.ForgotPasswordRequest;
import com.jobportal.dto.auth.ResetPasswordRequest;

public interface AuthService {
    void register(UserRegisterRequest request);
    TokenResponse login(LoginRequest request);
    TokenResponse adminLogin(LoginRequest request);
    String refreshUserToken(String refreshToken);
    String refreshAdminToken(String refreshToken);
    void logout(String refreshToken);
    void verifyOtp(OtpVerificationRequest request);
    void resendRegistrationOtp(String email);
    void processForgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}

