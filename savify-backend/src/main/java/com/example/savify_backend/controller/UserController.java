package com.example.savify_backend.controller;

import com.example.savify_backend.dto.AvailabilityRequest;
import com.example.savify_backend.entities.User;
import com.example.savify_backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    @PutMapping("/availability")
    public ResponseEntity<User> updateAvailability(@RequestBody AvailabilityRequest request){
        User updatedUser = userService.updateAvailability(request);
        return ResponseEntity.ok(updatedUser);
    }
}
