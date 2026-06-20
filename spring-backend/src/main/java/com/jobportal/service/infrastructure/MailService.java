package com.jobportal.service.infrastructure;

public interface MailService {
    void sendOtpMail(String to, String fullName, String otp, boolean isRegistration);
}
