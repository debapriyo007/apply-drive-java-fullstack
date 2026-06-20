package com.jobportal.service.auth;

import com.jobportal.dto.auth.LoginRequest;
import com.jobportal.dto.user.UserRegisterRequest;
import com.jobportal.dto.auth.OtpVerificationRequest;
import com.jobportal.dto.auth.ForgotPasswordRequest;
import com.jobportal.dto.auth.ResetPasswordRequest;
import com.jobportal.dto.auth.TokenResponse;
import com.jobportal.entity.RefreshToken;
import com.jobportal.entity.Role;
import com.jobportal.entity.User;
import com.jobportal.entity.RegistrationOtp;
import com.jobportal.entity.ForgotPasswordOtp;
import com.jobportal.exception.BadRequestException;
import com.jobportal.repository.RoleRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.repository.RegistrationOtpRepository;
import com.jobportal.repository.ForgotPasswordOtpRepository;
import com.jobportal.security.CustomUserDetails;
import com.jobportal.security.jwt.JwtTokenProvider;
import com.jobportal.service.auth.AuthService;
import com.jobportal.service.auth.RefreshTokenService;
import com.jobportal.service.infrastructure.MailService;
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

import java.time.LocalDateTime;
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
    private final RegistrationOtpRepository registrationOtpRepository;
    private final ForgotPasswordOtpRepository forgotPasswordOtpRepository;
    private final MailService mailService;

    @Override
    @Transactional
    public void register(UserRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use.");
        }

        // Generate a 6-digit random OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(1000000));
        
        // Encode the password before saving temporarily
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        RegistrationOtp registrationOtp = registrationOtpRepository.findByEmail(request.getEmail())
                .orElse(new RegistrationOtp());

        registrationOtp.setEmail(request.getEmail());
        registrationOtp.setFullName(request.getFullName());
        registrationOtp.setPassword(encodedPassword);
        registrationOtp.setOtp(otp);
        registrationOtp.setExpiryTime(LocalDateTime.now().plusMinutes(10));

        registrationOtpRepository.save(registrationOtp);

        // Dispatch Email
        mailService.sendOtpMail(request.getEmail(), request.getFullName(), otp, true);
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

    @Override
    @Transactional
    public void verifyOtp(OtpVerificationRequest request) {
        RegistrationOtp registrationOtp = registrationOtpRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("No registration session found for this email."));

        if (registrationOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP has expired. Please request a new code.");
        }

        if (!registrationOtp.getOtp().equals(request.getOtp())) {
            throw new BadRequestException("Invalid OTP code.");
        }

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new BadRequestException("ROLE_USER not found. Run DatabaseInitializer first."));

        User user = User.builder()
                .fullName(registrationOtp.getFullName())
                .email(registrationOtp.getEmail())
                .password(registrationOtp.getPassword())
                .roles(Collections.singleton(userRole))
                .isActive(true)
                .build();

        userRepository.save(user);
        registrationOtpRepository.delete(registrationOtp);
    }

    @Override
    @Transactional
    public void resendRegistrationOtp(String email) {
        RegistrationOtp registrationOtp = registrationOtpRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("No registration session found for this email."));

        String otp = String.format("%06d", new java.util.Random().nextInt(1000000));
        registrationOtp.setOtp(otp);
        registrationOtp.setExpiryTime(LocalDateTime.now().plusMinutes(10));
        registrationOtpRepository.save(registrationOtp);

        mailService.sendOtpMail(email, registrationOtp.getFullName(), otp, true);
    }

    @Override
    @Transactional
    public void processForgotPassword(ForgotPasswordRequest request) {
        if (!userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("No account found with this email address.");
        }

        String otp = String.format("%06d", new java.util.Random().nextInt(1000000));

        ForgotPasswordOtp forgotPasswordOtp = forgotPasswordOtpRepository.findByEmail(request.getEmail())
                .orElse(new ForgotPasswordOtp());

        forgotPasswordOtp.setEmail(request.getEmail());
        forgotPasswordOtp.setOtp(otp);
        forgotPasswordOtp.setExpiryTime(LocalDateTime.now().plusMinutes(10));
        forgotPasswordOtpRepository.save(forgotPasswordOtp);

        mailService.sendOtpMail(request.getEmail(), "", otp, false);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        ForgotPasswordOtp forgotPasswordOtp = forgotPasswordOtpRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("No reset request session found for this email."));

        if (forgotPasswordOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP has expired. Please request a new code.");
        }

        if (!forgotPasswordOtp.getOtp().equals(request.getOtp())) {
            throw new BadRequestException("Invalid OTP code.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found."));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        forgotPasswordOtpRepository.delete(forgotPasswordOtp);
    }
}

