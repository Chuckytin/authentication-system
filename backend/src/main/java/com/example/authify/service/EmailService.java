package com.example.authify.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.Duration;

/**
 * Servicio para el envío de correos electrónicos.
 */
@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Duration PASSWORD_RESET_EXPIRATION = Duration.ofMinutes(15);
    private static final Duration EMAIL_VERIFICATION_EXPIRATION = Duration.ofHours(24);

    private final JavaMailSender javaMailSender;

    private final TemplateEngine templateEngine;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    //TODO: añadir url login al .env una vez desplegado frontend y descomentar
//    @Value("${app.frontend.url.login}")
//    private String frontendUrlLogin;

    /**
     * Envía email de bienvenida a nuevos usuarios.
     */
    public void sendWelcomeEmail(String toEmail, String name) throws MessagingException {
        Context context = new Context();
        context.setVariable("name", name);
//      context.setVariable("loginUrl", frontendUrlLogin + "/login");

        String process = templateEngine.process("welcome-email", context);
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("¡Bienvenido a Authify!");
        helper.setText(process, true);

        javaMailSender.send(mimeMessage);
    }

    /**
     * Envía OTP para restablecimiento de contraseña.
     */
    public void sendResetOtpEmail(String toEmail, String otp) throws MessagingException {
        Context context = new Context();
        context.setVariable("email", toEmail);
        context.setVariable("otp", otp);
        context.setVariable("expirationTime", formatExpirationTime(PASSWORD_RESET_EXPIRATION));

        String process = templateEngine.process("password-reset-email", context);
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Forgot your password?");
        helper.setText(process, true);

        javaMailSender.send(mimeMessage);
    }

    /**
     * Envía OTP para verificación de cuenta.
     */
    public void sendOtpEmail(String toEmail, String otp) throws MessagingException {
       Context context = new Context();
       context.setVariable("email", toEmail);
       context.setVariable("otp", otp);
       context.setVariable("expirationTime", formatExpirationTime(EMAIL_VERIFICATION_EXPIRATION));

       String process = templateEngine.process("verify-email", context);
       MimeMessage mimeMessage = javaMailSender.createMimeMessage();
       MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);

       helper.setFrom(fromEmail);
       helper.setTo(toEmail);
       helper.setSubject("Account Verification OTP");
       helper.setText(process, true);

       javaMailSender.send(mimeMessage);
    }

    /**
     * Formatea la duración para mostrarla de manera amigable.
     */
    private String formatExpirationTime(Duration duration) {
        if (duration.toHours() >= 24) {
            return duration.toDays() + " día";
        } else if (duration.toMinutes() >= 60) {
            return duration.toHours() + " horas";
        } else {
            return duration.toMinutes() + " minutos";
        }
    }

}