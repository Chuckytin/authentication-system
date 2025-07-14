package com.example.authify.service;

import com.example.authify.entity.User;
import com.example.authify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

/**
 * Servicio personalizado para cargar detalles de usuario durante la autenticación.
 * Implementa la interfaz UserDetailsService de Spring Security.
 */
@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Carga los detalles del usuario por su dirección de email.
     * - Busca el usuario en la BBDD por email.
     * - Si no existe lanza UsernameNotFoundException.
     * Si existe, construye un UserDetails con el email, contraseña (encriptada) y authorities (roles).
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found for the email: " + email));
        return new org.springframework.security.core.userdetails.User(existingUser.getEmail(), existingUser.getPassword(), new ArrayList<>());
    }
}
