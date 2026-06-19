package com.jobportal.service.impl;

import com.jobportal.dto.request.LoginRequest;
import com.jobportal.dto.request.UserRegisterRequest;
import com.jobportal.dto.response.TokenResponse;
import com.jobportal.entity.RefreshToken;
import com.jobportal.entity.Role;
import com.jobportal.entity.User;
import com.jobportal.exception.BadRequestException;
import com.jobportal.repository.RoleRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.CustomUserDetails;
import com.jobportal.security.jwt.JwtTokenProvider;
import com.jobportal.service.AuthService;
import com.jobportal.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    @Value("${app.jwt.accessTokenExpirationMs}")
    private Long accessTokenExpirationMs;

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;

    @Override
    @Transactional
    public void register(UserRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use.");
        }
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new BadRequestException("ROLE_USER not found. Run DatabaseInitializer first."));

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Collections.singleton(userRole))
                .build();
        userRepository.save(user);
    }

    @Override
    public TokenResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        RefreshToken refreshToken = refreshTokenService.createRefreshTokenForUser(userDetails.getId());

        return TokenResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken.getToken())
                .email(userDetails.getEmail())
                .fullName(userDetails.getFullName())
                .role("ROLE_USER")
                .expiresIn(accessTokenExpirationMs)
                .build();
    }

    @Override
    public TokenResponse adminLogin(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();

        if (!principal.isAdmin()) {
            throw new AccessDeniedException("Access Denied: User does not have administrator privileges.");
        }

        String jwt = tokenProvider.generateToken(authentication);
        RefreshToken refreshToken = refreshTokenService.createRefreshTokenForAdmin(principal.getId());

        return TokenResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken.getToken())
                .email(principal.getEmail())
                .fullName(principal.getFullName())
                .role("ROLE_ADMIN")
                .expiresIn(accessTokenExpirationMs)
                .build();
    }

    @Override
    @Transactional
    public String refreshUserToken(String refreshTokenStr) {
        return refreshTokenService.findByToken(refreshTokenStr)
                .map(refreshTokenService::verifyExpiration)
                .map(rt -> {
                    User user = rt.getUser();
                    if (user == null) {
                        throw new BadRequestException("Token not associated with a user.");
                    }
                    Authentication auth = new UsernamePasswordAuthenticationToken(
                            CustomUserDetails.fromUser(user), null,
                            CustomUserDetails.fromUser(user).getAuthorities());
                    return tokenProvider.generateToken(auth);
                })
                .orElseThrow(() -> new BadRequestException("Invalid refresh token."));
    }

    @Override
    @Transactional
    public String refreshAdminToken(String refreshTokenStr) {
        return refreshTokenService.findByToken(refreshTokenStr)
                .map(refreshTokenService::verifyExpiration)
                .map(rt -> {
                    if (rt.getAdmin() == null) {
                        throw new BadRequestException("Token not associated with an admin.");
                    }
                    Authentication auth = new UsernamePasswordAuthenticationToken(
                            CustomUserDetails.fromAdmin(rt.getAdmin()), null,
                            CustomUserDetails.fromAdmin(rt.getAdmin()).getAuthorities());
                    return tokenProvider.generateToken(auth);
                })
                .orElseThrow(() -> new BadRequestException("Invalid refresh token."));
    }

    @Override
    @Transactional
    public void logout(String refreshTokenStr) {
        refreshTokenService.findByToken(refreshTokenStr).ifPresent(rt -> {
            if (rt.getUser() != null) {
                refreshTokenService.deleteByUserId(rt.getUser().getId());
            } else if (rt.getAdmin() != null) {
                refreshTokenService.deleteByAdminId(rt.getAdmin().getId());
            }
        });
    }
}
