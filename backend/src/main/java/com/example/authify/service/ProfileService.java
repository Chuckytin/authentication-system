package com.example.authify.service;

import com.example.authify.io.ProfileRequest;
import com.example.authify.io.ProfileResponse;

public interface ProfileService {

    ProfileResponse createProfile(ProfileRequest profileRequest);

}
