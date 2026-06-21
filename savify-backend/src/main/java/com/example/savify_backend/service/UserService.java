package com.example.savify_backend.service;

import com.example.savify_backend.dto.LoginRequest;
import com.example.savify_backend.dto.RegisterRequest;
import com.example.savify_backend.entities.User;
import org.springframework.stereotype.Service;

public interface UserService {
    User registerUser(RegisterRequest request);
}
