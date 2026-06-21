package com.example.savify_backend.dto;

import com.example.savify_backend.entities.BloodGroup;
import com.example.savify_backend.entities.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String contact;
    private Role role;
    private BloodGroup bloodGroup;
    private String address;
    private double latitude;
    private double longitude;
}