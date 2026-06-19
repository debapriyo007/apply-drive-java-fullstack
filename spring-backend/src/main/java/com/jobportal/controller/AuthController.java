package com.jobportal.controller;

import com.jobportal.dto.request.LoginRequest;
import com.jobportal.dto.request.UserRegisterRequest;
import com.jobportal.dto.response.MessageResponse;
import com.jobportal.dto.response.TokenResponse;
import com.jobportal.service.AuthService;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody UserRegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(new MessageResponse("User registered successfully."));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        TokenResponse tokenResponse = authService.login(request);

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", tokenResponse.getAccessToken())
                .httpOnly(true)
                .secure(false) // Set to true in production
                .path("/")
                .maxAge(12 * 60 * 60) // 12 hours
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", tokenResponse.getRefreshToken())
                .httpOnly(true)
                .secure(false) // Set to true in production
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 days
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        // Sanitize the response body to not expose raw tokens
        tokenResponse.setAccessToken(null);
        tokenResponse.setRefreshToken(null);

        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, String>> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {
        if (refreshToken == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Refresh token is missing."));
        }
        String jwt = authService.refreshUserToken(refreshToken);

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", jwt)
                .httpOnly(true)
                .secure(false) // Set to true in production
                .path("/")
                .maxAge(12 * 60 * 60) // 12 hours
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());

        return ResponseEntity.ok(Map.of("message", "Token refreshed successfully."));
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {
        if (refreshToken != null) {
            authService.logout(refreshToken);
        }

        ResponseCookie clearAccess = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, clearAccess.toString());

        ResponseCookie clearRefresh = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, clearRefresh.toString());

        return ResponseEntity.ok(new MessageResponse("Logged out successfully."));
    }
}