package com.jobportal.service.infrastructure;

import com.jobportal.service.infrastructure.MailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;
    private final ResourceLoader resourceLoader;

    @Value("${spring.mail.from:isdebu999@gmail.com}")
    private String fromEmail;

    @Override
    public void sendOtpMail(String to, String fullName, String otp, boolean isRegistration) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            
            String subject;
            String htmlContent;
            
            if (isRegistration) {
                subject = "Verify Your ApplyDrive Account";
                String rawTemplate = loadTemplate("email-registration.html");
                htmlContent = rawTemplate
                        .replace("{{fullName}}", fullName != null ? fullName : "Candidate")
                        .replace("{{otp}}", otp);
            } else {
                subject = "Reset Your ApplyDrive Password";
                String rawTemplate = loadTemplate("email-forgot-password.html");
                htmlContent = rawTemplate
                        .replace("{{fullName}}", fullName != null ? fullName : "Candidate")
                        .replace("{{otp}}", otp);
            }
            
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            
            mailSender.send(mimeMessage);
            log.info("OTP HTML template email successfully sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send OTP HTML template email to {}", to, e);
            throw new RuntimeException("Email delivery failed: " + e.getMessage(), e);
        }
    }

    private String loadTemplate(String templateName) {
        try {
            Resource resource = resourceLoader.getResource("classpath:templates/" + templateName);
            try (InputStream inputStream = resource.getInputStream()) {
                return StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
            }
        } catch (Exception e) {
            log.error("Failed to load email template: {}", templateName, e);
            throw new RuntimeException("Could not load email template: " + templateName, e);
        }
    }
}
