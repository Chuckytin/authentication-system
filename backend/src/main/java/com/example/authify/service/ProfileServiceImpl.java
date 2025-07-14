package com.example.authify.service;

import com.example.authify.entity.User;
import com.example.authify.io.ProfileRequest;
import com.example.authify.io.ProfileResponse;
import com.example.authify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

/**
 * Servicio para la gestión de perfiles de usuario.
 * Proporciona operaciones para crear perfiles y convertir entre entidades y DTOs.
 */
@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Crea un nuevo perfil de usuario a partir de los datos proporcionados.
     */
    public ProfileResponse createProfile(ProfileRequest profileRequest) {
        User newUser = convertToUser(profileRequest);

        if (!userRepository.existsByEmail(profileRequest.getEmail())) {
            newUser = userRepository.save(newUser);
            return convertToProfileResponse(newUser);
        }

        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists.");
    }

    /**
     * Convierte un ProfileRequest a la entidad User.
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
     * Convierte una entidad User a ProfileResponse.
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
