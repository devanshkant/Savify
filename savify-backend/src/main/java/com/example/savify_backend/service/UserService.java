package com.example.savify_backend.service;

import com.example.savify_backend.dto.AvailabilityRequest;
import com.example.savify_backend.dto.LoginRequest;
import com.example.savify_backend.dto.RegisterRequest;
import com.example.savify_backend.entities.User;

public interface UserService {
    User registerUser(RegisterRequest request);
    User loginUser(LoginRequest loginRequest);
    User updateAvailability(AvailabilityRequest request);
}
