package com.example.authify.controller;

import com.example.authify.io.ProfileRequest;
import com.example.authify.io.ProfileResponse;
import com.example.authify.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping("/register")
    public ProfileResponse register(@Valid @RequestBody ProfileRequest profileRequest) {
        ProfileResponse profileResponse = profileService.createProfile(profileRequest);
        //TODO: enviar email de bienvenida
        return profileResponse;
    }

    @GetMapping("/test")
    public String test() {
        return "Auth is working";
    }

}
