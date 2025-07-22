package com.example.authify.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Servicio para el envío de correos electrónicos.
 */
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    /**
     * Envía email de bienvenida a nuevos usuarios.
     */
    public void sendWelcomeEmail(String toEmail, String name) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(fromEmail);
        simpleMailMessage.setTo(toEmail);
        simpleMailMessage.setSubject("Welcome to Authify Platform");
        simpleMailMessage.setText(String.format("""
                Hello %s,
                
                Thanks for registering to our platform!
                
                Regards,
                The Authify Team
                """, name));
        javaMailSender.send(simpleMailMessage);
    }

    /**
     * Envía OTP para restablecimiento de contraseña.
     */
    public void sendResetOtpEmail(String toEmail, String otp) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(fromEmail);
        simpleMailMessage.setTo(toEmail);
        simpleMailMessage.setSubject("Your Password Reset Code");
        simpleMailMessage.setText(String.format("""
                Your password reset code is: %s
                
                This code will expire in 15 minutes.
                
                If you didn't request this, please ignore this email.
                """, otp));
        javaMailSender.send(simpleMailMessage);
    }

    /**
     * Envía OTP para verificación de cuenta.
     */
    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom(fromEmail);
        simpleMailMessage.setTo(toEmail);
        simpleMailMessage.setSubject("Your Account Verification OTP");
        simpleMailMessage.setText(String.format("""
                Your verification code is: %s
                
                Use this code to complete your account verification.
                
                This code will expire in 24 hours.
                """, otp));
        javaMailSender.send(simpleMailMessage);
    }
}
