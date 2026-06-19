package com.example.savify_backend.service.impl;

import com.example.savify_backend.dto.LoginRequest;
import com.example.savify_backend.dto.RegisterRequest;
import com.example.savify_backend.repository.UserRepository;
import com.example.savify_backend.service.UserService;
import org.springframework.stereotype.Service;


@Service
public class UserServiceImpl implements UserService {
    private UserRepository userRepository;

    @Override
    public String login(LoginRequest loginRequest) {

        return "";
    }

    @Override
    public void register(RegisterRequest registerRequest) {

    }
}
