package com.example.authify.service;

import com.example.authify.entity.User;
import com.example.authify.io.ProfileRequest;
import com.example.authify.io.ProfileResponse;
import com.example.authify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Servicio para la gestión de perfiles de usuario.
 * Proporciona operaciones para crear perfiles y convertir entre entidades y DTOs.
 */
@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    /**
     * Crea un nuevo perfil de usuario a partir de los datos proporcionados.
     */
    @Override
    public ProfileResponse createProfile(ProfileRequest profileRequest) {
        User newUser = convertToUser(profileRequest);

        if (!userRepository.existsByEmail(profileRequest.getEmail())) {
            newUser = userRepository.save(newUser);
            return convertToProfileResponse(newUser);
        }

        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists.");
    }

    /**
     * Obtiene la información del perfil asociado al email proporcionado.
     */
    @Override
    public ProfileResponse getProfile(String email) {
        User existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return convertToProfileResponse(existingUser);
    }

    /**
     * Genera y envía un OTP (One-Time Password) parae el proceso de reseteo de contraseña.
     * - Verifica que el usuario exista y que su cuenta no esté ya verificada
     * - Genera un OTP de 6 dígitos
     * - El OTP tiene una validez de 15 minutos.
     * - Actualiza los campos resetOtp y resetOtpExpireAt en la base de datos.
     * - Envía el OTP por correo electrónico.
     */
    @Override
    public void sendResetOtp(String email) {
        User existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));

        long expirationTime = System.currentTimeMillis() + (15 * 60 * 1000);

        existingUser.setResetOtp(otp);
        existingUser.setResetOtpExpireAt(expirationTime);

        userRepository.save(existingUser);

        try {
            emailService.sendResetOtpEmail(existingUser.getEmail(), otp);
        } catch (Exception e) {
            throw new RuntimeException("unable to send email");
        }
    }

    /**
     * Restablece la contraseña del usuario después de validar el OTP proporcionado.
     */
    @Override
    public void resetPassword(String email, String otp, String newPassword) {
        User existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        if (existingUser.getResetOtp() == null || !existingUser.getResetOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (existingUser.getResetOtpExpireAt() < System.currentTimeMillis()) {
            throw new RuntimeException("OTP Expired");
        }

        existingUser.setPassword(passwordEncoder.encode(newPassword));
        existingUser.setResetOtp(null);
        existingUser.setResetOtpExpireAt(0L);

        userRepository.save(existingUser);
    }

    /**
     * Envía un OTP al correo del usuario para la verificación de la cuenta.
     * - Verifica que el usuario exista y que su cuenta no esté ya verificada
     * - Genera un OTP de 6 dígitos
     * - Establece un tiempo de expiración de 24 horas para el OTP
     * - Actualiza los campos verifyOtp y verifyOtpEspireAt en la base de datos
     * - Envía el OTP por correo electrónico
     */
    @Override
    public void sendOtp(String email) {
        User existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        if (existingUser.getIsAccountVerified() != null && existingUser.getIsAccountVerified()) {
            return;
        }

        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));

        long expirationTime = System.currentTimeMillis() + (24 * 60 * 60 * 1000);

        existingUser.setVerifyOtp(otp);
        existingUser.setVerifyOtpEspireAt(expirationTime);

        userRepository.save(existingUser);

        try {
            emailService.sendOtpEmail(existingUser.getEmail(), otp);
        } catch (Exception e) {
            throw new RuntimeException("Unable to send email");
        }
    }

    /**
     * Verifica el OTP proporcionado por el usuario para validar su cuenta.
     * - Verifica que el usuario exista
     * - Valida que el OTP proporcionado coincida con el almacenado
     * - Comprueba que el OTP no haya expirado
     * - Marca la cuenta como verificada
     * - Limpia los campos de OTP y su tiempo de expiración
     */
    @Override
    public void verifyOtp(String email, String otp) {
        User existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        if (existingUser.getVerifyOtp() == null || !existingUser.getVerifyOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (existingUser.getVerifyOtpEspireAt() < System.currentTimeMillis()) {
            throw new RuntimeException("OTP Expired");
        }

        existingUser.setIsAccountVerified(true);
        existingUser.setVerifyOtp(null);
        existingUser.setVerifyOtpEspireAt(0L);

        userRepository.save(existingUser);
    }

    /**
     * Convierte un ProfileRequest a la entidad User.
     * - Codifica la contraseña usando PasswordEncoder
     * - Genera un userId único
     * - Establece valores por defecto para campos de verificación
     */
    private User convertToUser(ProfileRequest profileRequest) {
        return User.builder()
                .email(profileRequest.getEmail())
                .userId(UUID.randomUUID().toString())
                .name(profileRequest.getName())
                .password(passwordEncoder.encode(profileRequest.getPassword()))
                .isAccountVerified(false)
                .resetOtpExpireAt(0L)
                .verifyOtp(null)
                .verifyOtpEspireAt(0L)
                .resetOtp(null)
                .build();
    }

    /**
     * Convierte una entidad User a un DTO ProfileResponse.
     */
    private ProfileResponse convertToProfileResponse(User newProfile) {
        return ProfileResponse.builder()
                .name(newProfile.getName())
                .email(newProfile.getEmail())
                .userId(newProfile.getUserId())
                .isAccountVerified(newProfile.getIsAccountVerified())
                .build();
    }

}
