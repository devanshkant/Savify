package com.example.savify_backend.controller;

import com.example.savify_backend.dto.RegisterRequest;
import com.example.savify_backend.entities.User;
import com.example.savify_backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    public AuthController(UserService userService) {
        this.userService = userService;
    }
    @PostMapping("/register")
    public ResponseEntity<User> createUser(@RequestBody RegisterRequest registerRequest) {
        User savedUser = userService.registerUser(registerRequest);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }
}
